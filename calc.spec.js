// For node test only
const assert = require("assert");
const basic_data_type = {
    // opreation, action, number, notation
    type: "opreation",
    action: "+",
    shown: "+",
};

function draft1()
{
    for( let idx = 0; idx < input.length; idx++ )
    {
        crrent_item = input[idx];
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
        if( idx + 1 === input.length )
        {
            result.push( parseInt( tmp_number, 10 ) );
            tmp_number = null;
            crrent_item = null;
        }
    }
}

const _input_legel = (incoming_input, present_array) =>
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
        const is_float = input => input.type === "notation" && input.action === "float";
        const current_action = present_array[ present_array.length - 1 ];
        // Should not opreate when current is opreation.
        if ( current_action.type === "opreation" && incoming_input.type === "opreation" )
        {
            return false;
        }
        // No depulicate float
        if ( present_array.some( item => is_float( item ) ) )
        {
            return is_float( incoming_input ) === false;
        }
        // Its legel now
        return true;
    };
    return present_array.length < 1 ?
        empty_number_action( incoming_input ) :
        has_number_action( incoming_input, present_array );
};

const _input_legel_test_cases = [
    {
        input: {
            type: "opreation",
            action: "+",
            shown: "+",
        },
        opreations: [],
        expect: false,
        comment: "Should not plus when opreations is empty."
    },
    {
        input: {
            type: "opreation",
            action: "+",
            shown: "+",
        },
        // 1
        opreations: [{
            type: "number",
            action: "1",
            shown: "1",
        }],
        expect: true,
        comment: "Should plus when opreations has number."
    },
    {
        // +
        input: {
            type: "opreation",
            action: "-",
            shown: "-",
        },
        // 1+
        opreations: [{
            type: "number",
            action: "1",
            shown: "1",
        }, {
            type: "opreation",
            action: "+",
            shown: "+",
        }],
        expect: false,
        comment: "1++ is illgel"
    },
];

_input_legel_test_cases.map(item =>
    console.assert(_input_legel(item.input, item.opreations) === item.expect, item.comment)
);

const translate_opreator = input =>
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
};

const translate_opreator_cases = [
    // 1 + 1
    [{
        type: "number",
        action: "1",
        shown: "1",
    }, {
        type: "opreation",
        action: "+",
        shown: "+",
    }, {
        type: "number",
        action: "1",
        shown: "1",
    }],
    // 1024
    [{
        type: "number",
        action: "1",
        shown: "1",
    },{
        type: "number",
        action: "0",
        shown: "0",
    },{
        type: "number",
        action: "2",
        shown: "2",
    },{
        type: "number",
        action: "4",
        shown: "4",
    },],
    // 12 + 34
    [{
        type: "number",
        action: "1",
        shown: "1",
    },{
        type: "number",
        action: "2",
        shown: "2",
    }, {
        type: "opreation",
        action: "+",
        shown: "+",
    }, {
        type: "number",
        action: "3",
        shown: "3",
    }, {
        type: "number",
        action: "4",
        shown: "4",
    }],
    // 1 * 2 + 34
    [{
        type: "number",
        action: "1",
        shown: "1",
    }, {
        type: "opreation",
        action: "*",
        shown: "*",
    },{
        type: "number",
        action: "2",
        shown: "2",
    }, {
        type: "opreation",
        action: "+",
        shown: "+",
    }, {
        type: "number",
        action: "3",
        shown: "3",
    }, {
        type: "number",
        action: "4",
        shown: "4",
    }],
    []
];

const translate_opreator_expections = [
    [1,"+",1],
    [1024],
    [12,"+",34],
    [1,"*",2,"+",34],
    []
];

translate_opreator_cases.map( (item, index) =>
    assert.deepStrictEqual( translate_opreator( item ), translate_opreator_expections[index] )
);
