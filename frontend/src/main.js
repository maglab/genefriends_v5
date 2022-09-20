import {
    createApp
} from 'vue'
import { store } from './storage/main'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import TabMenu from 'primevue/tabmenu'
import Divider from 'primevue/divider'
import TieredMenu from 'primevue/tieredmenu'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Toolbar from 'primevue/toolbar'
import Rating from 'primevue/rating'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import RadioButton from 'primevue/radiobutton'
import InputNumber from 'primevue/inputnumber'
import Dialog from 'primevue/dialog'
import Chips from 'primevue/chips'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import MultiSelect from 'primevue/multiselect'
import Panel from 'primevue/panel'
import BlockUI from 'primevue/blockui'
import Timeline from 'primevue/timeline'
import Card from 'primevue/card'
import OrganizationChart from 'primevue/organizationchart'
import CascadeSelect from 'primevue/cascadeselect'
import InputSwitch from 'primevue/inputswitch'
import Fieldset from 'primevue/fieldset'
import ProgressSpinner from 'primevue/progressspinner'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Steps from 'primevue/steps'
import ScrollPanel from 'primevue/scrollpanel'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import AvatarGroup from 'primevue/avatargroup'
import Chip from 'primevue/chip'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Skeleton from 'primevue/skeleton'
import ProgressBar from 'primevue/progressbar'
import Menubar from 'primevue/menubar'
import SelectButton from 'primevue/selectbutton'
import Slider from 'primevue/slider';

/* import '../node_modules/primevue/resources/themes/saga-blue/theme.css' //theme */
import '../node_modules/primevue/resources/themes/md-light-indigo/theme.css'
import '../node_modules/primevue/resources/primevue.min.css' //core css
import '../node_modules/primeicons/primeicons.css' //icons
import '../node_modules/primeflex/primeflex.css' // grid system (just like bootstrap, but easier)
import './registerServiceWorker'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(PrimeVue)
app.use(ToastService)

app.component('Button', Button)
app.component('InputText', InputText)
app.component('FileUpload', FileUpload)
app.component('Toast', Toast)
app.component('TabMenu', TabMenu)
app.component('Divider', Divider)
app.component('TieredMenu', TieredMenu)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ColumnGroup', ColumnGroup)
app.component('Toolbar', Toolbar)
app.component('Rating', Rating)
app.component('Textarea', Textarea)
app.component('Dropdown', Dropdown)
app.component('RadioButton', RadioButton)
app.component('InputNumber', InputNumber)
app.component('Dialog', Dialog)
app.component('Chips', Chips)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('MultiSelect', MultiSelect)
app.component('Panel', Panel)
app.component('BlockUI', BlockUI)
app.component('Timeline', Timeline)
app.component('Card', Card)
app.component('OrganizationChart', OrganizationChart)
app.component('CascadeSelect', CascadeSelect)
app.component('InputSwitch', InputSwitch)
app.component('Fieldset', Fieldset)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('Steps', Steps)
app.component('ScrollPanel', ScrollPanel)
app.component('Badge', Badge)
app.component('Avatar', Avatar)
app.component('AvatarGroup', AvatarGroup)
app.component('Chip', Chip)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('Skeleton', Skeleton)
app.component('ProgressBar', ProgressBar)
app.component('Menubar', Menubar)
app.component('SelectButton', SelectButton)
app.component('Slider', Slider)

app.mount('#app')