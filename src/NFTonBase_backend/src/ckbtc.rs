use crate::types::{
    Account, GetBalanceRequest, GetBtcAddressRequest, TransferError, TransferRequest,
    TransferResult, UpdateBalanceError, UpdateBalanceRet, UtxoStatus, WithdrawError,
    WithdrawRequest, WithdrawResult,
};
use candid::Principal;
use ic_ledger_types::{Subaccount, AccountIdentifier};
use sha2::{Digest, Sha256};

pub async fn deposit(principal: String) -> (String, String) {
    let mut hasher = Sha256::new();
    hasher.update(principal);
    let result = hasher.finalize();
    let sub_id = Subaccount(result.into());

    let get_btc_request = GetBtcAddressRequest {
        owner: Some(ic_cdk::api::id()),
        subaccount: Some(sub_id.0.to_vec()),
    };

    let btc_address_res = ic_cdk::call::<(GetBtcAddressRequest,), (String,)>(
        Principal::from_text("mqygn-kiaaa-aaaar-qaadq-cai").unwrap(),
        "get_btc_address",
        (get_btc_request,),
    )
    .await;
    match btc_address_res {
        Err((_, err)) => ("".to_string(), err.to_string()),
        Ok((btc_address,)) => (btc_address, "".to_string()),
    }
}

pub async fn update_balance(principal: String) -> (u64, String) {
    let mut hasher = Sha256::new();
    hasher.update(principal.clone());
    let result = hasher.finalize();
    let sub_id = Subaccount(result.into());

    let get_balance_request = GetBtcAddressRequest {
        owner: Some(ic_cdk::api::id()),
        subaccount: Some(sub_id.0.to_vec()),
    };

    let balance_res = ic_cdk::call::<(GetBtcAddressRequest,), (UpdateBalanceRet,)>(
        Principal::from_text("mqygn-kiaaa-aaaar-qaadq-cai").unwrap(),
        "update_balance",
        (get_balance_request,),
    )
    .await;
    match balance_res {
        Err((_, err)) => (0, err.to_string()),
        Ok((balance,)) => match balance {
            UpdateBalanceRet::Ok(utxo_vec) => {
                let mut total_amount = 0;
                utxo_vec.into_iter().for_each(|utxo| match utxo {
                    UtxoStatus::Minted {
                        minted_amount,
                        block_index: _,
                        utxo: _,
                    } => {
                        total_amount += minted_amount;
                    }
                    _ => {}
                });
                (total_amount, "".to_string())
            }
            UpdateBalanceRet::Err(update_balance_err) => match update_balance_err {
                UpdateBalanceError::NoNewUtxos {
                    required_confirmations,
                    pending_utxos,
                    current_confirmations,
                } => {
                    if pending_utxos.is_none() {
                        (0, format!("There is now upcoming transactions."))
                    } else if pending_utxos.clone().unwrap().len() > 0 {
                        let mut amount = 0;
                        pending_utxos.unwrap().iter().for_each(|utxo| {
                            amount += utxo.value;
                        });
                        (0, format!("Required comfirmation is {}, but current comfirmation is {}.\n{} ckBTC will be minted.", required_confirmations, current_confirmations.unwrap_or(0), (((amount - 100) as f64)/100000000f64)))
                    } else {
                        (0, format!("There is no upcoming transactions."))
                    }
                }
                UpdateBalanceError::AlreadyProcessing => (0, format!("Already processing.")),
                UpdateBalanceError::TemporarilyUnavailable(error_string) => (0, error_string),
                UpdateBalanceError::GenericError {
                    error_message,
                    error_code: _,
                } => (0, error_message),
            },
        },
    }
}

pub async fn get_address(principal: String) -> String {
    let mut hasher = Sha256::new();
    hasher.update(principal);
    let result = hasher.finalize();
    let sub_id= Subaccount(result.into());
    let new_subaccount = AccountIdentifier::new( &ic_cdk::api::id(), &sub_id);
    new_subaccount.to_string()
}

pub async fn get_btc_balance(principal: String) -> (String, String) {
    let mut hasher = Sha256::new();
    hasher.update(principal);
    let result = hasher.finalize();
    let sub_id = Subaccount(result.into());

    let get_balance_request = GetBalanceRequest {
        owner: ic_cdk::api::id(),
        subaccount: Some(sub_id.0.to_vec()),
    };

    let get_balance_res = ic_cdk::call::<(GetBalanceRequest,), (u128,)>(
        Principal::from_text("mxzaz-hqaaa-aaaar-qaada-cai").unwrap(),
        "icrc1_balance_of",
        (get_balance_request,),
    )
    .await;
    match get_balance_res {
        Err((_, err)) => ("0".to_string(), err.to_string()),
        Ok((balance,)) => (balance.to_string(), "".to_string()),
    }
}

pub async fn get_usdc_balance(principal: String) -> (String, String) {
    let mut hasher = Sha256::new();
    hasher.update(principal);
    let result = hasher.finalize();
    let sub_id = Subaccount(result.into());

    let get_balance_request = GetBalanceRequest {
        owner: ic_cdk::api::id(),
        subaccount: Some(sub_id.0.to_vec()),
    };

    let get_balance_res = ic_cdk::call::<(GetBalanceRequest,), (u128,)>(
        Principal::from_text("xevnm-gaaaa-aaaar-qafnq-cai").unwrap(),
        "icrc1_balance_of",
        (get_balance_request,),
    )
    .await;
    match get_balance_res {
        Err((_, err)) => ("0".to_string(), err.to_string()),
        Ok((balance,)) => (balance.to_string(), "".to_string()),
    }
}

pub async fn transfer(principal: String, to_principal: String, amount: i32) -> (String, String) {
    //from account
    let mut from_hasher = Sha256::new();
    from_hasher.update(principal.clone());
    let from_result = from_hasher.finalize();
    let from_subaccount = Subaccount(from_result.into());

    //to account
    let mut to_hasher = Sha256::new();
    to_hasher.update(to_principal.clone());
    let to_result = to_hasher.finalize();
    let to_subaccount = Subaccount(to_result.into());

    let to_account = Account {
        owner: ic_cdk::api::id(),
        subaccount: Some(to_subaccount.0.to_vec()),
    };

    let transfer_request = TransferRequest {
        to: to_account,
        fee: None,
        memo: None,
        from_subaccount: Some(from_subaccount.0.to_vec()),
        created_at_time: None,
        amount: candid::Nat::from(amount.clone() as u32),
    };

    let transfer_result_res = ic_cdk::call::<(TransferRequest,), (TransferResult,)>(
        Principal::from_text("mxzaz-hqaaa-aaaar-qaada-cai").unwrap(),
        "icrc1_transfer",
        (transfer_request,),
    )
    .await;
    match transfer_result_res {
        Err((_, err)) => ("0".to_string(), err.to_string()),
        Ok((transfer_result,)) => match transfer_result {
            TransferResult::Ok(block_index) => {
                ("Success".to_string(), "".to_string())
            }
            TransferResult::Err(transfer_err) => match transfer_err {
                TransferError::GenericError {
                    message,
                    error_code,
                } => ("0".to_string(), message),
                TransferError::InsufficientFunds { balance } => (
                    "0".to_string(),
                    format!("Insufficiant balane : {}", balance),
                ),
                _ => ("0".to_string(), "Unexpected error.".to_string()),
            },
        },
    }
}

pub async fn withdraw(to_principal: String, address: String, amount: u64) -> (String, String) {
    let mut from_hasher = Sha256::new();
    from_hasher.update(to_principal.clone());
    let from_result = from_hasher.finalize();
    let from_subaccount = Subaccount(from_result.into());

    let withdraw_request = WithdrawRequest {
        from_subaccount: Some(from_subaccount.0.to_vec()),
        address: address.clone(),
        amount: amount.clone(),
    };

    let withdraw_reault_res = ic_cdk::call::<(WithdrawRequest,), (WithdrawResult,)>(
        Principal::from_text("mqygn-kiaaa-aaaar-qaadq-cai").unwrap(),
        "retrieve_btc_with_approval",
        (withdraw_request,),
    )
    .await;
    match withdraw_reault_res {
        Err((_, err)) => ("0".to_string(), err.to_string()),
        Ok((transfer_result,)) => match transfer_result {
            WithdrawResult::Ok(withdraw_ok) => {
                ("Success".to_string(), "".to_string())
            }
            WithdrawResult::Err(withdraw_err) => match withdraw_err {
                WithdrawError::GenericError {
                    error_message,
                    error_code,
                } => ("0".to_string(), error_message),
                WithdrawError::InsufficientFunds { balance } => (
                    "0".to_string(),
                    format!("Insufficiant balane : {}", balance),
                ),
                WithdrawError::MalformedAddress(address) => {
                    ("0".to_string(), format!("MalformedAddress : {}", address))
                }
                WithdrawError::TemporarilyUnavailable(error) => (
                    "0".to_string(),
                    format!("TemporarilyUnavailable : {}", error),
                ),
                WithdrawError::AlreadyProcessing => {
                    ("0".to_string(), format!("Already Processing"))
                }
                WithdrawError::AmountTooLow(amount) => (
                    "0".to_string(),
                    format!(
                        "Amount Too Low: Minimum amount is {}",
                        amount
                    ),
                ),
            },
        },
    }
}
