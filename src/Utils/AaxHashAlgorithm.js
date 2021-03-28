export default class AaxHashAlgorithm {
    static Instance = new AaxHashAlgorithm();
 
    __fixed_key = [0x77, 0x21, 0x4d, 0x4b, 0x19, 0x6a, 0x87, 0xcd, 0x52, 0x00, 0x45, 0xfd, 0x20, 0xa5, 0x1d, 0x67];
 
 
    // Convert a hex string to a byte array
    __hexToBytes(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
 
        return bytes;
    }
 
    // Convert a byte array to a hex string
    __bytesToHex(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hex.push((current >>> 4).toString(16));
            hex.push((current & 0xF).toString(16));
        }
        return hex.join("");
    }
 
    async __HashData(data) {
        let source = new Uint8Array(data);
        let buffer = await crypto.subtle.digest('SHA-1', source);
        return Array.from(new Uint8Array(buffer));
    }
 
    async CalculateChecksum(activationBytes) {
        let data = this.__hexToBytes(activationBytes);
 
        let intermediate_key = await this.__HashData(this.__fixed_key.concat(data));
        let intermediate_iv = await this.__HashData(this.__fixed_key.concat(intermediate_key).concat(data));
        let checksum = await this.__HashData(intermediate_key.slice(0, 16).concat(intermediate_iv.slice(0, 16)));
 
        return this.__bytesToHex(checksum);
    }
 
    static async CalculateChecksum(activationBytes){
        return AaxHashAlgorithm.Instance.CalculateChecksum(activationBytes);
    }
}