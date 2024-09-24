import Header from "./components/Header"
import Guitar from "./components/Guitar"
import { useState, useEffect } from "react"
import { db } from "./data/db"

function App() {

  const initialCart = () =>{
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []

  }

  //Reglas de los hooks
  //parte superior de react
  //no se colocan dentro de condicionales ni despues de un return 
  //tampoco se ponen dentro de condicionales
  //tampoco hooks dentro de funciones
  const [data,setData] = useState([])
  const [cart,setCart] = useState(initialCart )
  const MAX_ITEMS = 5;
  const MIN_QUANTITY = 0;

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart]) //cada que cart cambie queremos ejecutar la dependencia


  function addToCart(item){
    const itemExist = cart.findIndex((guitar) => guitar.id === item.id)
    //console.log('soy itemExist =>',itemExist);

    if((itemExist >= 0)){
      const updatedCart = [...cart]
      if ( updatedCart[itemExist].quantity < MAX_ITEMS ) {
        updatedCart[itemExist].quantity++
        console.log("existe" , updatedCart)
      }else{
        alert("Solo puedes agregar 5 productos")
      }
      setCart(updatedCart)

    }else{
      console.log("no existe agregando... ");
      item.quantity = 1
      setCart([...cart,item])      
    }
    

  }

  function addToCarts(id){
    
    const updatedCart =  cart.map( item => {
      if(item.id === id){
        return {
          ...item, 
          quantity: item.quantity + 1
        }
      }
      return item
    })
    console.log(updatedCart); 
  }

  

  function removeToCart(item){
  
    const itemExist = cart.findIndex((guitar) => guitar.id === item.id)
    console.log(itemExist);

    if(itemExist >= 0){
      const updatedCart = [...cart]
      updatedCart[itemExist].quantity--
      if(updatedCart[itemExist].quantity === MIN_QUANTITY){
        updatedCart.splice(itemExist,1)
      }
      console.log("existe")
      setCart(updatedCart)

    }else{
      console.log("no existe agregando... ");
      item.quantity = 1
      setCart([...cart,item])      
    }

  }

  function removeTocartAll(id){
    console.log('Eliminando... ', id)
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
  }

  function clearCart(){
    setCart([])
  }


  //El hook useEffect se usa para diferentes escenarios
  //sieempre toma un callback que realiza diferentes acciones
  useEffect(() =>{
    //Si es posible tener condiciones dentro de un useEffect
    /*if(auth){
      console.log('Autenticado');
    }*/

    //Se ejecuta cuando el componente esta listo
    //buen lugar para colocar codigo de consulta de una API o obtener datos de localstorage
    setData(db)

    //el arreglo vacio dice que no recibe dependendias por lo tanto se ejecuta una sola vez
    //y ademas se ejecuta cuando el componente este listo
  }, [])
 
  console.log(data);

  return (
    <>
      <Header 
        cart={cart}
        addToCart={addToCart}
        removeToCart={removeToCart}
        removeTocartAll={removeTocartAll}
        clearCart={clearCart}
      />


      <main className='container-xl mt-5'>
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {
            //el .map se puede usar expresion dentro de un App.jsx y del return solo si se espera una coleccion de arreglos
            //map no se puede usar en un null 
            data.map ((guitar) =>(
              <Guitar 
                key={guitar.id}
                guitar = {guitar}
                setCart={setCart}
                addToCart={addToCart}
              />   
            ))
          }
          
        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>

    </>
  )
}

export default App
