import React, { useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

const App = () => {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [randomImg, setRandomImg ] = useState('http://i.imgflip.com/1bij.jpg');
  const [allMemeImgs, setAllMemeImgs ] = useState([]);

  function handleChangeTop(event){
    setTopText(event.target.value)
}

const handleChangeBottom = (event) => {
  setBottomText(event.target.value);
}


  
  useEffect(
    ()=> {
        fetch("https://api.imgflip.com/get_memes")
            .then(response => response.json())
            .then(response => {
                const {memes} = response.data
                console.log(`response.data: ${response.data}`)
                console.log(`memes: ${memes}`)
                const urls = response.data.url; 
                console.log(`urls: ${urls}`)
                setAllMemeImgs( memes )
            })
            // console.log(response.data)
    }, []
  );

  const handleSubmit=(event)=>{
    event.preventDefault()
    const randNum = Math.floor(Math.random() * allMemeImgs.length)
    // const randNum=10;
    console.log(`allmemeimgs: ${allMemeImgs}`)
    console.log(`randnum: ${randNum}`)
    console.log(`allMemeImgs:${allMemeImgs}`)
    const randMemeImg = allMemeImgs[randNum].url
    setRandomImg(randMemeImg)
  }

  return (
      <div>
          <form className="meme-form" onSubmit={handleSubmit}>
              <input 
                  type="text"
                  name="topText"
                  placeholder='top text'
                  value={topText}
                  onChange={handleChangeTop}
              /> 
              <input 
                  type="text"
                  name="bottomText"
                  placeholder="Bottom Text"
                  value={bottomText}
                  onChange={handleChangeBottom}
              /> 
          
              <button>Gen</button>
          </form>
          <div className="meme">
              <img 
                src={randomImg} 
                // src='https://i.imgflip.com/30b1gx.jpg' 
                alt="" 
                width='700'
              />
              <h2 className="top">{topText}</h2>
              <h2 className="bottom">{bottomText}</h2>
          </div>
      </div>
  )
}

export default App;


// import React, { Component } from "react"

// class App extends Component {
//     constructor() {
//         super()
//         this.state = {
//             topText: "",
//             bottomText: "",
//             randomImg: "http://i.imgflip.com/1bij.jpg",
//             allMemeImgs: []
//         }
//         this.handleChange = this.handleChange.bind(this)
//         this.handleSubmit = this.handleSubmit.bind(this)
//     }
    
//     componentDidMount() {
//         fetch("https://api.imgflip.com/get_memes")
//             .then(response => response.json())

//             .then(response => {
//                 const {memes} = response.data
//                 console.log(`response.data: ${response.data}`)
//                 console.log(`memes: ${memes}`)
//                 const urls = response.data.url; 
//                 console.log(`urls: ${urls}`)
//                 this.setState({ allMemeImgs: memes })
//             })
//     }
    
//     handleChange(event) {
//         const {name, value} = event.target
//         this.setState({ [name]: value })
//     }
    
//     handleSubmit(event) {
//         event.preventDefault()
//         const randNum = Math.floor(Math.random() * this.state.allMemeImgs.length)
//         const randMemeImg = this.state.allMemeImgs[randNum].url
//         this.setState({ randomImg: randMemeImg })
//     }
    
//     render() {
//         return (
//             <div>
//                 <form className="meme-form" onSubmit={this.handleSubmit}>
//                     <input 
//                         type="text"
//                         name="topText"
//                         placeholder="Top Text"
//                         value={this.state.topText}
//                         onChange={this.handleChange}
//                     /> 
//                     <input 
//                         type="text"
//                         name="bottomText"
//                         placeholder="Bottom Text"
//                         value={this.state.bottomText}
//                         onChange={this.handleChange}
//                     /> 
                
//                     <button>Gen</button>
//                 </form>
//                 <div className="meme">
//                     <img src={this.state.randomImg} alt="" />
//                     <h2 className="top">{this.state.topText}</h2>
//                     <h2 className="bottom">{this.state.bottomText}</h2>
//                 </div>
//             </div>
//         )
//     }
// }

// export default App