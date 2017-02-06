
declare module LZMA {
    
    function compress(input:string):ArrayBuffer;
    function decompress(buf:ArrayBuffer):string;
    
}
