export default function(CodeMirror){
    var powerUp = (mode)=>{
        mode(CodeMirror)
        return function(){
             if(arguments[0]) return powerUp(arguments[0]);
         }
      }
      return powerUp;
}