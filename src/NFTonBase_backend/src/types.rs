use serde::Serialize;
use candid::{CandidType, Deserialize};

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
    // pub streaming_strategy: Option<StreamingStrategy>,
}

// #[derive(Clone, Debug, CandidType, Deserialize)]
// pub struct Token {}

// #[derive(Clone, Debug, CandidType, Deserialize)]
// pub enum StreamingStrategy {
//     Callback { callback: Func, token: Token },
// }