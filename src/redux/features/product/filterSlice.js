import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    filteredProducts: [],
}

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        FILTER_PRODUCTS(state, action) {
            const { products, search } = action.payload
            const searchTerm = search ? search.toLowerCase() : "";
            const temProducts = products.filter(
                (product) => 
                    (product.name && product.name.toLowerCase().includes(searchTerm)) ||
                    (product.category && product.category.toLowerCase().includes(searchTerm))
            ); 
            state.filteredProducts = temProducts;
        }
    }
});

export const { FILTER_PRODUCTS } = filterSlice.actions

export const selectFilteredProducts = (state) => state.filter.filteredProducts;

export default filterSlice.reducer
