const getters = {
    ukey: state => state.user.ukey,
    token: state => state.user.auth_token,
    name: state => state.user.name,
    mobile: state => state.user.mobile,
    email: state => state.user.email,
    id_card: state => state.user.id_card,
    create_at: state => state.user.create_at,
    account_type: state => state.user.account_type,
    ca: state => state.user.ca,
    user_sn: state => state.user.user_sn,
    idx: state => state.contract.idx,
    ca_no: state => state.user.ca_no,
    company_no: state => state.user.company_no
};
export default getters;
