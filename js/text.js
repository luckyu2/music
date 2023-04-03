$(function(){
  var arr1 = [1, 2, 3];
  var arr2 = ['a', 'b', 'c'];
  var arr3 = ['x', 'y', 'z'];

  var $ul = $('<ul>');
  $.each([arr1, arr2, arr3], function(index, arr) {
    $.each(arr, function(i, val) {
      var $li = $('<li>').text(val);
      $ul.append($li);
    });
  });

  $('#show-list').click(function() {
    layer.open({
      type: 1,
      title: 'My List',
      content: $ul.prop('outerHTML')
    });
  });
  
})