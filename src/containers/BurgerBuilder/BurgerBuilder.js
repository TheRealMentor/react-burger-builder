import React , { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.4,
  cheese: 1,
  meat: 1.3,
  bacon: 1.1
};

class BurgerBuilder extends Component {

  state = {
    ingredients: null,
    totalPrice: 2,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount = () => {
    axios.get("https://burger-builder-226e0.firebaseio.com/ingredients.json")
      .then(res => {
        this.setState({ ingredients: res.data });
      })
      .catch(err => {
        this.setState({ error: true });
      });
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
    //alert('Thank you for purchasing!');
    this.setState({ loading: true });

    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Sharad Roy',
        address: {
          street: 'Himalaya',
          zipCode: '456789',
          country: 'India'
        },
        email: "test@gmail.com"
      },
      deliveryMethod: "fastest"
    }

    axios.post('/orders.json', order)
        .then(response => {
          this.setState({ laoding: false, purchasing: false });
        })
        .catch(err => {
          console.log(err);
          this.setState({ laoding: false, purchasing: false });
        });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    };

    let orderSummary = null;
    let burger = this.state.error ? <p>Server is down!!</p> : <Spinner />;

    if(this.state.ingredients) {
      burger = (<Aux>
                  <Burger ingredients={this.state.ingredients}/>
                  <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}
                    price={this.state.totalPrice}
                    ordered={this.purchaseHandler} />
                </Aux>);

      orderSummary = <OrderSummary 
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinue={this.purchaseContinueHandler}  />;
    }

    if(this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        
        <Modal 
          show={this.state.purchasing} 
          modalClosed={this.purchaseCancelHandler} >
          {orderSummary}
        </Modal>

        {burger}
      
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);