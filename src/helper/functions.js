const createTextIcon = (string) => {
    if (string) {
        const words = string.trim().split(' ');
        if (words.length > 1) {
            return (words[0][0] + words[1][0])
        } else {
            return words[0][0]
        }
    }
    return null
};

export default createTextIcon;