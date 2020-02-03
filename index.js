// https://www.freecodecamp.org/news/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98/
class CalculatorCore {
    constructor()
    {
        this.opreations = [];
        this.result_array = [];
        this.result = 0;
    }
    reset_state()
    {
        this.opreations = [];
        this.result_array = [];
        this.result = 0;
    }
    detect_type( str )
    {
        let the_number = parseInt( str, 10 );
        let action_types = {
            "+": {
                type: "opreation",
                action: "+",
                shown: "+",
            },
            "-": {
                type: "opreation",
                action: "-",
                shown: "-",
            },
            "*": {
                type: "opreation",
                action: "*",
                shown: "×",
            },
            "/": {
                type: "opreation",
                action: "/",
                shown: "÷",
            },
            ".": {
                type: "notation",
                action: "float",
                shown: ".",
            },
            "neg": {
                type: "notation",
                action: "negetive",
                shown: "-",
            },
            "ac": {
                type: "action",
                action: "clear",
                shown: null,
            },
            "=": {
                type: "action",
                action: "result",
                shown: null,
            },
        };
        if( isNaN( the_number ) )
        {
            return action_types[ str ];
        }
        return {
            type: "number",
            action: the_number,
            shown: the_number,
        };
    }
    calc_action( input_data )
    {
        switch ( input_data.action )
        {
            case "clear":
                this.reset_state();
                break;
            case "result":
                this.result_array = this.translate_opreations( this.opreations );
                this.result = eval( this.result_array.join("") );
                break;
            default:
                break;
        }
    }
    input_legel( incoming_input, present_array )
    {
        const empty_number_action = incoming_input =>
        {
            let type = incoming_input.type;
            let action = incoming_input.action;
            // No actions and opreations
            if ( type === "action" || type === "opreation" )
            {
                return false;
            }
            // No depulicate zero
            if ( type === "number" && action === 0 )
            {
                return false;
            }
            // Its legel now
            return true;
        };
        const has_number_action = ( incoming_input, present_array ) =>
        {
            const current_action = present_array[ present_array.length - 1 ];
            // Should not opreate when current is opreation.
            if ( current_action.type === "opreation" && incoming_input.type === "opreation" )
            {
                return false;
            }
            // Its legel now
            return true;
        };
        return present_array.length < 1 ? empty_number_action( incoming_input ) : has_number_action( incoming_input, present_array );
    }
    notation_action( input_data )
    {
        switch ( input_data.action )
        {
            case "float":
                console.log( this.opreations );
                break;
            default:
                break;
        }
    }
    translate_opreations( input )
    {
        let result = [];
        let tmp_number = "";
        input.forEach( (crrent_item, idx, array) =>
        {
            if( crrent_item.type === "opreation" )
            {
                result.push( parseInt( tmp_number, 10 ) );
                result.push( crrent_item.action );
                tmp_number = "";
            }
            else
            {
                tmp_number += String( crrent_item.action );
            }
            // Last index
            if( idx + 1 === array.length )
            {
                result.push( parseInt( tmp_number, 10 ) );
                tmp_number = null;
                crrent_item = null;
            }
        });
        return result;
    }
}

class CalculatorInterface extends CalculatorCore {
    text_render()
    {
        const generate_shown_text = ( opreations, input_result ) =>
        {
            let the_text = "0";
            let current_item = opreations[ opreations.length - 1 ];
            if( opreations.length > 0 )
            {
                if( current_item.type === "action" && current_item.action === "result" )
                {
                    the_text = input_result;
                }
                else
                {
                    the_text = opreations.map( item => item.shown ).join("");
                }
            }
            current_item = null;
            return the_text;
        }
        document.querySelector("[data-i-calc='result']").innerText = String(
            generate_shown_text( this.opreations, this.result )
        );
    }
    // Following methods changes the state "opreations".
    add( dom )
    {
        let input_data = this.detect_type( dom.dataset.iCalc );
        if( this.input_legel( input_data, this.opreations ) )
        {
            this.opreations.push( input_data );
        }
        switch ( input_data.type )
        {
            case "action":
                this.calc_action( input_data );
                break;
            case "notation":
                this.notation_action( input_data );
                break;
            default:
                break;
        }
        this.text_render();
    }
    remove()
    {
        this.opreations.pop();
    }
}

const main = () =>
{
    const app = new CalculatorInterface();
    [ ...document.querySelectorAll(".btn[data-i-calc]") ].map( dom =>
        dom.addEventListener( "click", event => app.add( event.target ) )
    );
};

document.onload = main();
