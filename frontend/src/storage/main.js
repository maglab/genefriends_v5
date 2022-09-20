import { genesStore } from './genes';
import { createStore } from 'vuex'
  
  const store = createStore({
    modules: { genesStore }
  })

export { store }