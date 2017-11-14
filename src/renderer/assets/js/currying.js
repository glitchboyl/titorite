export default CodeMirror => {
    var powerUp = mode => {
        mode(CodeMirror)
        return () => {
            if (arguments[0]) 
                return powerUp(arguments[0]);
            }
        }
    return powerUp;
}