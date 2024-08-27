mod evm;
mod ckbtc;
mod types;
use ic_cdk::api::management_canister::http_request::{HttpResponse, TransformArgs};

#[ic_cdk::query]
pub fn whoami() -> String {
    ic_cdk::api::caller().to_string()
}

#[ic_cdk::update]
async fn upload_image(image_key: String, image_data: Vec<u8>) -> String {
    evm::upload_image(image_key, image_data).await
}

#[ic_cdk::update]
async fn upload_data(receipt_key: String, receipt_data: String) -> String {
    evm::upload_data(receipt_key, receipt_data).await
}

#[ic_cdk::update]
pub async fn get_system_address() -> String {
    evm::get_system_address().await
}

#[ic_cdk::update]
pub async fn get_evm_address(principal: String) -> String {
    evm::get_evm_address(principal).await
}

#[ic_cdk::update]
pub async fn get_base_eth_balance(address: String) -> (u64, String) {
    evm::get_base_eth_balance(address).await
}

#[ic_cdk::update]
pub async fn send_base_eth(to_add: String, amount: u64) -> (String, String) {
    evm::send_base_eth(to_add, amount).await
}

#[ic_cdk::update]
pub async fn mint_nft(to_address: String, uri: String, amount: i32) -> String {
    evm::mint_nft(to_address, uri, amount).await
}

#[ic_cdk::query]
fn http_request(req: types::HttpRequest) -> types::HttpResponse {
    evm::http_request(req)
}

#[ic_cdk::query]
pub fn transform(response: TransformArgs) -> HttpResponse {
    let mut t = response.response;
    t.headers = vec![];
    t
}

#[ic_cdk::update]
async fn deposit_btc(principal: String) -> (String, String) {
    ckbtc::deposit(principal).await
}

#[ic_cdk::update]
async fn update_btc_balance(principal: String) -> (u64, String) {
    ckbtc::update_balance(principal).await
}

#[ic_cdk::update]
async fn get_address(principal: String) -> String {
    ckbtc::get_address(principal).await
}

#[ic_cdk::update]
async fn get_btc_balance(principal: String) -> (String, String) {
    ckbtc::get_btc_balance(principal).await
}

#[ic_cdk::update]
async fn get_usdc_balance(principal: String) -> (String, String) {
    ckbtc::get_usdc_balance(principal).await
}

#[ic_cdk::update]
async fn transfer_btc(principal: String, to_principal: String, amount: i32) -> (String, String) {
    ckbtc::transfer(principal, to_principal, amount).await
}

#[ic_cdk::update]
async fn withdraw_btc(principal: String, address: String, amount: i32) -> (String, String) {
    ckbtc::withdraw(principal, address, amount as u64).await
}