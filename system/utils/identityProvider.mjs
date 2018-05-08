import crypto from 'crypto';

export default class IdentityProvider{
    static provideIdentity(realm,id){
        return crypto.createHash('md5').update(realm + '_'+ id).digest('hex');
    }
}