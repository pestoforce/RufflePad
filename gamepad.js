let flashObj = null;
let jsLoggingEnabled = false;


window.addEventListener('DOMContentLoaded', () => {
    myInit();
});

window.addEventListener("gamepadconnected", (e) => {
    const [index, id, numBtns, numAxes] = 
        [e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length];
    jsLog(`Gamepad connected at index ${index}: ${id}. ${numBtns} buttons, ${numAxes} axes.`);

    if (!!flashObj && !!flashObj.handlePadEvent) {
        flashObj.handlePadEvent("gamepadconnected", e.gamepad.index);
    }
});

window.addEventListener("gamepaddisconnected", (e) => {
    const [index, id] = [e.gamepad.index, e.gamepad.id];
    jsLog(`Gamepad disconnected from index ${index}: ${id}`);

    if (!!flashObj && flashObj.handlePadEvent) {
        flashObj.handlePadEvent("gamepaddisconnected", e.gamepad.index);
    }
});

function myInit() {
    // once the DOM is loaded, store a ref to the swf object
    jsLog("DOM Initialized!");
    flashObj = document.getElementById("output");
}

/*
Called from within the .swf file via ExternalInterface to request the state of a specified gamepad by index.
Function finishes by triggering receievPadState within the .swf file and provides:

index: number = the index of the requested gamepad

buttons: string[] = an array of gamepad buttons with either "true" or "false" for each gamepad button index
based on whether the button is currently pressed

axes: number[] = an array of axis values ranging from -1 to 1 for each axis on the controller indexed
by the axis' location on the gamepad
*/
function requestPadState(index) {
    // We must re-query gamepads afresh to get current state (Chrome limitation)
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);

    if (!gamepads[index]) {
        return;
    }

    for (const gamepad of gamepads) {
        if (+gamepad.index == +index) {
            const buttons = [];
            const axes = [];

            for (var i=0; i<gamepad.buttons.length; i++) {
              var val = gamepad.buttons[i];
              buttons[i] = val.pressed;
            }

            for (var i=0; i<gamepad.axes.length; i++) {
              var val = gamepad.axes[i];
              axes[i] = val;
            }

            flashObj.receivePadState(index, buttons, axes);
        }
    }
}

/*
Only log to js console if jsLogging is enabled
*/
function jsLog(msg) {
    if (jsLoggingEnabled) {
        console.log(msg);
    }
}
