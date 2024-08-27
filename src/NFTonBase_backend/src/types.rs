use serde::Serialize;
use candid::{CandidType, Deserialize, Principal};

use serde_bytes::ByteBuf;

#[derive(Serialize, Deserialize, CandidType)]
pub struct Image {
    pub name: String,
    pub img: Vec<u8>
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct HttpRequest {
    pub method: String,
    pub url: String,
    pub headers: Vec<(String, String)>,
    pub body: ByteBuf,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct HttpResponse {
    pub status_code: u16,
    pub headers: Vec<(String, String)>,
    pub body: ByteBuf,
}

#[derive(Clone, Serialize, CandidType)]
pub struct GetBtcAddressRequest {
    pub owner: Option<Principal>,
    pub subaccount: Option<Vec<u8>>,
}

#[derive(Clone, Serialize, CandidType)]
pub struct GetBalanceRequest {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>,
}

#[derive(CandidType, Deserialize)]
pub struct UtxoOutpoint {
    pub txid: Vec<u8>,
    pub vout: u32,
}

#[derive(CandidType, Deserialize)]
pub struct Utxo {
    pub height: u32,
    pub value: u64,
    pub outpoint: UtxoOutpoint,
}

#[derive(CandidType, Deserialize)]
pub enum UtxoStatus {
    ValueTooSmall(Utxo),
    Tainted(Utxo),
    Minted {
        minted_amount: u64,
        block_index: u64,
        utxo: Utxo,
    },
    Checked(Utxo),
}

#[derive(CandidType, Deserialize, Clone)]
pub struct PendingUtxoOutpoint {
    pub txid: Vec<u8>,
    pub vout: u32,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct PendingUtxo {
    pub confirmations: u32,
    pub value: u64,
    pub outpoint: PendingUtxoOutpoint,
}

#[derive(CandidType, Deserialize)]
pub enum UpdateBalanceError {
    GenericError {
        error_message: String,
        error_code: u64,
    },
    TemporarilyUnavailable(String),
    AlreadyProcessing,
    NoNewUtxos {
        required_confirmations: u32,
        pending_utxos: Option<Vec<PendingUtxo>>,
        current_confirmations: Option<u32>,
    },
}

#[derive(CandidType, Deserialize)]
pub enum UpdateBalanceRet {
    Ok(Vec<UtxoStatus>),
    Err(UpdateBalanceError),
}

#[derive(CandidType, Deserialize)]
pub struct TransferRequest {
  pub to: Account,
  pub fee: Option<candid::Nat>,
  pub memo: Option<Vec<u8>>,
  pub from_subaccount: Option<Vec<u8>>,
  pub created_at_time: Option<u64>,
  pub amount: candid::Nat,
}

#[derive(CandidType, Deserialize)]
pub struct Account {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>,
  }

  #[derive(CandidType, Deserialize)]
pub enum TransferError {
  GenericError{ message: String, error_code: candid::Nat },
  TemporarilyUnavailable,
  BadBurn{ min_burn_amount: candid::Nat },
  Duplicate{ duplicate_of: candid::Nat },
  BadFee{ expected_fee: candid::Nat },
  CreatedInFuture{ ledger_time: u64 },
  TooOld,
  InsufficientFunds{ balance: candid::Nat },
}

#[derive(CandidType, Deserialize)]
pub enum TransferResult { Ok(candid::Nat), Err(TransferError) }

#[derive(CandidType, Deserialize)]
pub struct WithdrawRequest{
    pub from_subaccount: Option<Vec<u8>>,
    pub address: String,
    pub amount: u64
}

#[derive(CandidType, Deserialize)]
pub enum WithdrawResult { Ok(WithdrawOk), Err(WithdrawError) }

#[derive(CandidType, Deserialize)]
pub struct WithdrawOk { pub block_index: u64 }

#[derive(CandidType, Deserialize)]
pub enum WithdrawError {
  MalformedAddress(String),
  GenericError{ error_message: String, error_code: u64 },
  TemporarilyUnavailable(String),
  AlreadyProcessing,
  AmountTooLow(u64),
  InsufficientFunds{ balance: u64 },
}
