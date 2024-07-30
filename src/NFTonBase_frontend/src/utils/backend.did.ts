/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-expect-error

export const idlFactory = ({ IDL }) => {
  const ByteBuf = IDL.Vec(IDL.Nat8);
  const HttpHeader = IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text });
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : ByteBuf,
    'headers' : IDL.Vec(HttpHeader),
  });
  const HttpResponse = IDL.Record({
    'body' : ByteBuf,
    'headers' : IDL.Vec(HttpHeader),
    'status_code' : IDL.Nat16,
  });
  const TransformArgs = IDL.Record({
    'context' : IDL.Vec(IDL.Nat8),
    'response' : HttpResponse,
  });
  return IDL.Service({
    'get_base_eth_balance' : IDL.Func([IDL.Text], [IDL.Nat64, IDL.Text], []),
    'get_evm_address' : IDL.Func([IDL.Text], [IDL.Text], []),
    'get_system_address' : IDL.Func([], [IDL.Text], []),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'mint_nft' : IDL.Func([IDL.Text, IDL.Text, IDL.Int32], [IDL.Text], []),
    'send_base_eth' : IDL.Func([IDL.Text, IDL.Nat64], [IDL.Text, IDL.Text], []),
    'transform' : IDL.Func([TransformArgs], [HttpResponse], ['query']),
    'upload_data' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    'upload_image' : IDL.Func([IDL.Text, IDL.Vec(IDL.Nat8)], [IDL.Text], []),
  });
};
export const init = () => { return []; };

// export const init = ({ IDL }) => { return []; };
