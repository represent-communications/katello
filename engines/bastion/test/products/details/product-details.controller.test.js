/**
 * Copyright 2014 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 **/

describe('Controller: ProductDetailsController', function() {
    var $scope;

    beforeEach(module('Bastion.products', 'Bastion.test-mocks'))

    beforeEach(inject(function($injector) {
        var $controller = $injector.get('$controller'),
            $state = $injector.get('$state'),
            Product = $injector.get('MockResource').$new();

        $scope = $injector.get('$rootScope').$new();

        $scope.$stateParams = {productId: 1};
        $scope.removeRow = function() {};

        $controller('ProductDetailsController', {
            $scope: $scope,
            $state: $state,
            Product: Product
        });
    }));

    it("gets the system using the Product service and puts it on the $scope.", function() {
        expect($scope.product).toBeDefined();
    });

    it('provides a method to remove a product', function() {
        spyOn($scope, 'transitionTo');
        spyOn($scope, 'removeRow');

        $scope.removeProduct($scope.product);

        expect($scope.transitionTo).toHaveBeenCalledWith('products.index');
        expect($scope.removeRow).toHaveBeenCalledWith($scope.product.id);
    });

    it("provivdes a method to check if a product is read only", function() {
        var product = {readonly: false, redhat: false};
        expect($scope.isReadOnly(product)).toBe(false);

        product.readonly = true;
        expect($scope.isReadOnly(product)).toBe(true);

        product.redhat = true;
        expect($scope.isReadOnly(product)).toBe(true);

        product.readonly = false;
        expect($scope.isReadOnly(product)).toBe(true);
    });
});
