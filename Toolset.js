export const TOOLS = [
    "brush",
    "rectangle",
]

export class Toolset {
    constructor() {
        this.tools = [];
        this.selected = null;
    }

    /**
     * INTERNAL USE 
     * @param {string} tool 
     * @returns 
     */
    checkTool(tool) {
        const lowerTool = tool.toLowerCase();
        if ((!TOOLS.includes(lowerTool)) || this.tools.includes(lowerTool)) return false;
        return true;
    }

    /**
     * @param {string} tool 
     */
    addTool(tool) {
        if (!this.checkTool(tool)) return;
        this.tools.push(tool.toLowerCase());
    }

    /**
     * @param {string[]} toolsArr 
     */
    setup(toolsArr) {
        toolsArr.forEach((element, index) => {
            this.tools.push(element)
            if (index === 0) this.selected = element;
        })
        return this;
    }

    /**
     * @param {string} toolRndCase
     */
    selectTool(toolRndCase) {
        const tool = toolRndCase.toLowerCase();
        console.log(`${tool} is being selected`)
        // if (!this.checkTool(tool)) return;
        console.log(`${tool} is selected`)
        this.selected = tool;
    }

    /**
     * 
     * @returns {string} - selected tool
     */
    getSelected() {
        return this.selected;
    }
}