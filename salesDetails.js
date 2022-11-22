window.onload = function() {
    var src = document.getElementById("src_customer_name"),
        dst = document.getElementById("dst_customer_name");
        src.addEventListener('input', function() {
        dst.value = src.value;
    });
};