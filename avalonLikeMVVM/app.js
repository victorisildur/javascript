window.onload =function() {
    var model = MVVM.define("MainController", function(vm) {
        vm.width = 150;
        vm.click = function() {
            vm.width  = parseFloat(vm.width) + 10;
        }
    });

    MVVM.scanTag();
}

