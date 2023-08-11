$(function loader() {
    var includes = $('[data-include]')
    $.each(includes, function () {
        var file = 'html/' + $(this).data('include') + '.html';
        $(this).load(file)
    })
})