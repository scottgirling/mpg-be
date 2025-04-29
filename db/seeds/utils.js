const formatRecipeInstructions = ({ instructions, ...otherProperties }) => {
    if (!instructions) return { ... otherProperties };

    const formattedInstructions = instructions.map((instruction) => {
        return instruction.replaceAll(",", "^");
    });

    return { instructions: formattedInstructions, ...otherProperties };
}

module.exports = formatRecipeInstructions;