$(function () {
    var includes = $('[data-include]')
    $.each(includes, function () {
        var file = 'GiacchettiLuigi-Portfolio/html/' + $(this).data('include') + '.html';
        $(this).load(file)
    })
})