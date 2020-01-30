import * as actionTypes from '../actions/actionTypes';


const initialState = {
    error: null,
    initIncome: null,
    teams: [{
            id: 6673,
            income: []
        },
        {
            id: 6682,
            income: []
        },
        {
            id: 6687,
            income: []
        },
        {
            id: 6689,
            income: []
        },
        {
            id: 6699,
            income: []
        },
        {
            id: 6697,
            income: []
        },
        {
            id: 6692,
            income: []
        },
        {
            id: 6700,
            income: []
        },
        {
            id: 6701,
            income: []
        },
        {
            id: 6704,
            income: []
        },
        {
            id: 6706,
            income: []
        },
        {
            id: 6707,
            income: []
        },
        {
            id: 6711,
            income: []
        },
        {
            id: 6717,
            income: []
        },
        {
            id: 6722,
            income: []
        },
        {
            id: 6723,
            income: []
        },
        {
            id: 6704,
            income: []
        },
        {
            id: 6705,
            income: []
        },
        {
            id: 11600,
            income: []
        },
        {
            id: 12427,
            income: []
        },
        {
            id: 13522,
            income: []
        },
        {
            id: 14149,
            income: []
        },
        {
            id: 15446,
            income: []
        },
        {
            id: 15946,
            income: []
        },
        {
            id: 15947,
            income: []
        },
        {
            id: 15948,
            income: []
        },
        {
            id: 16439,
            income: []
        },
        {
            id: 17203,
            income: []
        },
        {
            id: "pozostałe",
            income: []
        }
    ]
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_FILE:
            return {
                ...state,
                initIncome: action.income
            };
        case actionTypes.FETCH_FILE_FAILED:
            return {
                ...state,
                error: action.error
            }
        case actionTypes.SORT_INCOME:
            const newTeams = action.sortedIncome
            return {
                ...state,
                teams: newTeams
            }
        default:
            return state;
    }

}

export default reducer;