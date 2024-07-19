/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-expect-error

export const idlFactory = ({ IDL }) => {
  const HttpResponse = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text })),
  });
  const TransformArgs = IDL.Record({
    'context' : IDL.Vec(IDL.Vec(IDL.Nat8)),
    'response' : HttpResponse,
  });
  return IDL.Service({
    'get_gpt_data' : IDL.Func([IDL.Text], [IDL.Text], []),
    'send_image_url_to_proxy' : IDL.Func([IDL.Text], [IDL.Text], []),
    'transform' : IDL.Func([TransformArgs], [HttpResponse], ['query']),
  });
};
export const init = () => { return []; };
