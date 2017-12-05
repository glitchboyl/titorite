export default(CodeMirror, modes) => {
    return modes.forEach(mode => {
        mode(CodeMirror);
    });
}