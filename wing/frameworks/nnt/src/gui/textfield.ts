module nn {

    export interface CTextField
    {
        /** 只读 */
        readonly:boolean;
        
        /** 占位文字 */
        placeholder:string;
        
        /** 占位字体颜色 */
        placeholderTextColor:ColorType;

        /** 多行编辑 */
        multilines:boolean;

        /** 安全编辑 */
        securityInput:boolean;
    }

}
