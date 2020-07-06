import $ from 'jquery'

if (!$) {
    require('jquery')
} else {    
    window.$ = $
    window.jQuery = $
}