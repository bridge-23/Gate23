use ic_web3::{
    contract::{Contract, Options},
    ethabi::ethereum_types::U256,
    ic::{get_eth_addr, KeyInfo},
    transports::ICHttp,
    types::{Address, TransactionParameters},
    Web3,
};
use serde::Serialize;
use std::cell::RefCell;
use std::str::FromStr;
use crate::types;

use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};

type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static IMAGE_STORE: RefCell<StableBTreeMap<String, Vec<u8>, Memory>> =
        RefCell::new(StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
    ));

    static RECEIPT_STORE: RefCell<StableBTreeMap<String, String, Memory>> =
        RefCell::new(StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
    ));
}

const NFT_ABI: &[u8] = include_bytes!("./NFTABI.json");
const RPC_ENDPOINT: &str = "https://base.drpc.org";
const CONTRACT_ADDRESS: &str = "0x1CFEA7ecB518B3e4C5f72f11bc0F8E75A070A5C0";
const KEY_NAME: &str = "key_1";
const CHAIN_ID: u64 = 8453;
const GAS_PRICE: u64 = 50000000;

#[derive(Clone, Serialize)]
pub struct Contact {
    pub name: String,
    pub address: String,
}

pub async fn upload_image(image_key: String, image_data: Vec<u8>) -> String {
    IMAGE_STORE.with(|image_store| {
        if image_store.borrow().get(&image_key).is_some() {
            "Image name already exist".to_string()
        } else {
            image_store
                .borrow_mut()
                .insert(image_key.clone(), image_data);
            image_key
        }
    })
}

pub async fn upload_data(receipt_key: String, receipt_data: String) -> String {
    RECEIPT_STORE.with(|receipt_store| {
        if receipt_store.borrow().get(&receipt_key).is_some() {
            "data key already exist".to_string()
        } else {
            receipt_store
                .borrow_mut()
                .insert(receipt_key.clone(), receipt_data);
            receipt_key
        }
    })
}

pub async fn get_system_address() -> String {
    let principal = ic_cdk::api::caller().to_string();
    let derivation: Vec<Vec<u8>> = principal
        .split('-')
        .map(|word| word.as_bytes().to_vec())
        .collect();
    let res = get_eth_addr(None, Some(derivation), KEY_NAME.to_string()).await;
    format!("0x{}", hex::encode(res.unwrap()))
}

pub async fn get_evm_address(principal: String) -> String {
    let derivation: Vec<Vec<u8>> = principal
        .split('-')
        .map(|word| word.as_bytes().to_vec())
        .collect();
    let res = get_eth_addr(None, Some(derivation), KEY_NAME.to_string()).await;
    format!("0x{}", hex::encode(res.unwrap()))
}

pub async fn get_base_eth_balance(address: String) -> (u64, String) {
    let w3 = match ICHttp::new(RPC_ENDPOINT, None) {
        Ok(v) => Web3::new(v),
        Err(e) => return (0, e.to_string()),
    };
    let evm_address = &address[2..];
    let balance = w3
        .eth()
        .balance(Address::from_str(evm_address).unwrap(), None)
        .await;
    match balance {
        Ok(bal) => (bal.as_u64(), "".to_string()),
        Err(err) => (0, err.to_string()),
    }
}

pub async fn send_base_eth(to_add: String, amount: u64) -> (String, String) {
    let principal = ic_cdk::api::caller().to_string();
    // ecdsa key info
    let derivation_path: Vec<Vec<u8>> = principal
        .split('-')
        .map(|word| word.as_bytes().to_vec())
        .collect();
    // let derivation_path = vec![params.user_name.as_bytes().to_vec()];
    let key_info = KeyInfo {
        derivation_path: derivation_path.clone(),
        key_name: KEY_NAME.to_string(),
        ecdsa_sign_cycles: Some(21_538_461_538),
    };

    // get canister eth address
    let from_addr = get_eth_addr(None, Some(derivation_path), KEY_NAME.to_string())
        .await
        .unwrap();

    let w3 = match ICHttp::new(RPC_ENDPOINT, None) {
        Ok(v) => Web3::new(v),
        Err(e) => return (e.to_string(), "".to_string()),
    };

    let tx_catch = w3.eth().transaction_count(from_addr, None).await;

    match tx_catch {
        Ok(tx_count) => {
            // construct a transaction
            let address = &to_add[2..];
            let to_addr = match Address::from_str(address) {
                Ok(add) => add,
                Err(err) => {
                    return (err.to_string(), "".to_string());
                }
            };
            let tx = TransactionParameters {
                to: Some(to_addr),
                nonce: Some(tx_count),
                value: U256::from(amount),
                gas_price: Some(U256::from(GAS_PRICE)),
                gas: U256::from(21000),
                ..Default::default()
            };

            // sign the transaction and get serialized transaction + signature
            let signed_tx_res = w3
                .accounts()
                .sign_transaction(tx, hex::encode(from_addr), key_info, CHAIN_ID)
                .await;

            match signed_tx_res {
                Ok(signed_tx) => {
                    let tx_hash_res = w3
                        .eth()
                        .send_raw_transaction(signed_tx.raw_transaction)
                        .await;

                    match tx_hash_res {
                        Ok(tx_hash) => ("".to_string(), hex::encode(tx_hash)),
                        Err(error) => {
                            if error.to_string().contains("already known") {
                                ("Success".to_string(), "".to_string())
                            } else {
                                (error.to_string(), "".to_string())
                            }
                        }
                    }
                }
                Err(error) => (error.to_string(), "".to_string()),
            }
        }
        Err(error) => (error.to_string(), "".to_string()),
    }
}

pub async fn mint_nft(to_address: String, uri: String, amount: i32) -> String {
    let destination_address = Address::from_str(&to_address[2..]).unwrap();

    let derivation_path: Vec<Vec<u8>> = ic_cdk::api::caller()
        .to_string()
        .split('-')
        .map(|word| word.as_bytes().to_vec())
        .collect();
    let from_address =
        get_eth_addr(None, Some(derivation_path.clone()), KEY_NAME.to_string()).await;
    let key_info = KeyInfo {
        derivation_path,
        key_name: KEY_NAME.to_string(),
        ecdsa_sign_cycles: Some(21_538_461_538),
    };

    let w3 = match ICHttp::new(RPC_ENDPOINT, None) {
        Ok(v) => Web3::new(v),
        Err(e) => {
            return format!("error during create web3 interface: {}", e.to_string());
        }
    };

    let contract_address = Address::from_str(&CONTRACT_ADDRESS[2..]).unwrap();
    let contract_res = Contract::from_json(w3.eth(), contract_address, NFT_ABI);

    match contract_res {
        Ok(contract) => {
            let tx_count = match w3
                .eth()
                .transaction_count(from_address.clone().unwrap(), None)
                .await
            {
                Ok(v) => v,
                Err(e) => {
                    return format!("error during getting nonce: {}", e.to_string());
                }
            };

            let mut nonce_loop = true;
            let mut nonce_plus = 0;
            let mut result = "".to_string();

            while nonce_loop {
                let options = Options::with(|op| {
                    op.gas = Some(U256::from(300000));
                    op.nonce = Some(tx_count + U256::from(nonce_plus));
                    op.gas_price = Some(U256::from(GAS_PRICE));
                });

                let txhash_res = contract
                    .signed_call(
                        "mint",
                        (destination_address, U256::from(amount), uri.clone()),
                        options,
                        hex::encode(from_address.clone().unwrap()),
                        key_info.clone(),
                        CHAIN_ID,
                    )
                    .await;

                match txhash_res {
                    Ok(tx_hash) => {
                        nonce_loop = false;
                        result = hex::encode(tx_hash)
                    }
                    Err(error) => {
                        if error.to_string().contains("already known") {
                            result = "Success".to_string();
                            nonce_loop = false;
                        } else if error.to_string().contains("nonce") {
                            nonce_plus += 1;
                        } else {
                            result = format!("error during tx: {}", error.to_string());
                            nonce_loop = false;
                        }
                    }
                };
            }
            result
        }
        Err(error) => format!("error during getting contract: {}", error.to_string()),
    }
}

pub fn http_request(req: types::HttpRequest) -> types::HttpResponse {
    if req.url.contains("image") {
        let res: Vec<&str> = req.url.split("image").collect();
        let image_key = res[1][1..].to_string();
        IMAGE_STORE.with(|image_store| {
            if image_store.borrow().get(&image_key).is_some() {
                let image_data = image_store.borrow().get(&image_key).unwrap().clone();
                let mut http_header = req.headers;
                http_header.push(("CONTENT_TYPE".to_string(), "image/png".to_string()));
                let response = types::HttpResponse {
                    headers: http_header,
                    status_code: 200,
                    body: image_data.into(),
                };
                response
            } else {
                let response = types::HttpResponse {
                    headers: req.headers,
                    status_code: 404,
                    body: b"Image not found!".to_vec().into(),
                };
                response
            }
        })
    } else if req.url.contains("receipt") {
        let res: Vec<&str> = req.url.split("receipt").collect();
        let receipt_key = res[1][1..].to_string();
        RECEIPT_STORE.with(|receipt_store| {
            if receipt_store.borrow().get(&receipt_key).is_some() {
                let receipt_data = receipt_store.borrow().get(&receipt_key).unwrap().clone();
                let mut http_header = req.headers;
                http_header.push(("CONTENT_TYPE".to_string(), "text/json".to_string()));
                let response = types::HttpResponse {
                    headers: http_header,
                    status_code: 200,
                    body: receipt_data.as_bytes().to_vec().into(),
                };
                response
            } else {
                let response = types::HttpResponse {
                    headers: req.headers,
                    status_code: 404,
                    body: b"Receipt data not found!".to_vec().into(),
                };
                response
            }
        })
    } else {
        let response = types::HttpResponse {
            headers: req.headers,
            status_code: 404,
            body: req.url.as_bytes().to_vec().into(),
        };
        response
    }
}