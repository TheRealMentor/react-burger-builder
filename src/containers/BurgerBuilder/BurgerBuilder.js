import React , { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
  salad: 0.4,
  cheese: 1,
  meat: 1.3,
  bacon: 1.1
};

class BurgerBuilder extends Component {

  state = {
    ingredients: {
      salad: 0,
      meat: 0,
      bacon: 0,
      cheese: 0
    },

    totalPrice: 2,
    purchasable: false,
    purchasing: false
  }

  updatePurchaseState(ingredients) {

    const sum = Object.keys(ingredients).map(igKey => {
      return ingredients[igKey];
    }).reduce((acc, curr) => {
      return acc + curr;
    }, 0);

    this.setState({purchasable: sum > 0});
  }

  addIngredientHandler = (type) => {
    //Updating Count
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;

    const updatedIngredient = {
      ...this.state.ingredients
    };

    updatedIngredient[type] = updatedCount;

    //Updating Price
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({
      ingredients: updatedIngredient,
      totalPrice: newPrice
    });

    this.updatePurchaseState(updatedIngredient);

  };

  removeIngredientHandler = (type) => {
    //Updating Count
    const oldCount = this.state.ingredients[type];
     
    if(oldCount <= 0) {
      return;
    }

    const updatedCount = oldCount - 1;

    const updatedIngredient = {
      ...this.state.ingredients
    };

    updatedIngredient[type] = updatedCount;

    //Updating Price
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({
      ingredients: updatedIngredient,
      totalPrice: newPrice
    });

    this.updatePurchaseState(updatedIngredient);
  };

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    alert('Thank you for purchasing!');
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    return (
      <Aux>
        <Modal 
          show={this.state.purchasing} 
          modalClosed={this.purchaseCancelHandler} >
          <OrderSummary 
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinue={this.purchaseContinueHandler}  />
        </Modal>
        <Burger ingredients={this.state.ingredients}/>
        <BuildControls 
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          purchasable={this.state.purchasable}
          price={this.state.totalPrice}
          ordered={this.purchaseHandler} />
      </Aux>
    );
  }
}

export default BurgerBuilder;