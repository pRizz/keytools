import React, { Component } from 'react'
import * as nano from 'nanocurrency'
import { InputGroup, FormControl, Button} from 'react-bootstrap'
import * as helpers from '../helpers'
import MainPage from '../mainPage'
import {toast } from 'react-toastify'
import QrImageStyle from './components/qrImageStyle'
const toolParam = 'pow'

class WorkGeneratorTool extends Component {
  constructor(props) {
    super(props)

    this.webGLPower = [256,512,1024,2048,4096,8192,16384]

    this.state = {
      workHash: '',
      work: '',
      qrContent: '',
      qrSize: 512,
      activeQR: false,
      qrHidden: true,
      qrState: 0,  //qr size
      validWorkHash: false,
      validWork: false,
      generating: false,
      output: '',
      savedOutput: [],
      selectedOption: '3',
    }

    this.handleWorkHashChange = this.handleWorkHashChange.bind(this)
    this.sample = this.sample.bind(this)
    this.generateWork = this.generateWork.bind(this)
    this.updateQR = this.updateQR.bind(this)
    this.clearText = this.clearText.bind(this)
    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.double = this.double.bind(this)
    this.clearOutput = this.clearOutput.bind(this)
  }

  // Init component
  componentDidMount() {
    window.NanoWebglPow.width = this.webGLPower[3]
    window.NanoWebglPow.height = 256

    // Read URL params from parent and construct new quick path
    var hash = this.props.state.hash
    var load = this.props.state.load
    if (hash) {
      this.workHashChange(hash)
    }
    if (parseInt(load) < this.webGLPower.length) {
      this.loadChange(load)
    }
    if (!hash && !load) {
      this.setParams()
    }
  }

  // Defines the url params
  setParams() {
    helpers.setURLParams('?tool='+toolParam + '&hash='+this.state.workHash + '&load='+this.state.selectedOption)
  }

  //Clear text from input field
  clearText(event) {
    switch(event.target.value) {
      case 'workHash':
        this.setState({
          workHash: '',
          validWorkHash: false
        },
        function() {
          this.updateQR()
          this.setParams()
        })
        break

        case 'work':
          this.setState({
            work: '',
            validWork: false
          },
          function() {
            this.updateQR()
            this.setParams()
          })
          break
      default:
        break
    }
  }

  clearOutput() {
    this.setState({
      output: '',
      savedOutput: []
    })
  }

  // loop qr state 1x, 2x, 4x
  double() {
    var state = this.state.qrState
    state = state + 1
    if (state >= helpers.qrClassesContainer.length) {
      state = 0
    }
    this.setState({
      qrState: state
    })
  }

  // Select GPU load
  handleOptionChange = changeEvent => {
    this.loadChange(changeEvent.target.value)
  }

  loadChange(val) {
    this.setState({
      selectedOption: val
    },function() {
      this.setParams()
    })
    window.NanoWebglPow.width = this.webGLPower[parseInt(val)]
    window.NanoWebglPow.height = 256

  }

  // Any QR button is pressed
  handleQRChange = changeEvent => {
    let val = changeEvent.target.value
    // deselect button if clicking on the same button
    if (this.state.qrActive === val) {
      this.setState({
        qrActive: '',
        qrHidden: true
      })
    }
    else {
      this.setState({
        qrActive: val,
        qrHidden: false,
      },
      function() {
        this.updateQR()
      })
    }
  }

  updateQR() {
    switch(this.state.qrActive) {
      case 'workHash':
        this.setState({
          qrContent: this.state.workHash,
        })
        break
        case 'work':
          this.setState({
            qrContent: this.state.work,
          })
          break
      default:
        this.setState({
          qrContent: '',
          qrHidden: true,
        })
        break
    }
  }

  sample() {
    this.setState({
      workHash: '4E5004CA14899B8F9AABA7A76D010F73E6BAE54948912588B8C4FE0A3B558CA5',
      validWorkHash: true,
    },
    function() {
      this.updateQR()
      this.setParams()
    })
  }

  handleWorkHashChange(event) {
    this.workHashChange(event.target.value)
  }

  workHashChange(hash) {
    if (!nano.checkHash(hash)) {
      this.setState({
        workHash: hash,
        validWorkHash: false,
      },
      function() {
        this.updateQR()
      })
      if (hash !== '') {
        new MainPage().notifyInvalidFormat()
      }
      return
    }
    this.setState({
      workHash: hash,
      validWorkHash: true,
    },
    function() {
      this.updateQR()
      this.setParams()
    })
  }

  generateWork() {
    this.setState({
      generating: true
    })

    if (this.state.validWorkHash) {
      try {
        toast("Started generating PoW...", helpers.getToast(helpers.toastType.SUCCESS_AUTO))
        const start = Date.now()
        window.NanoWebglPow(this.state.workHash,
          (work, n) => {
              const hashes = window.NanoWebglPow.width * window.NanoWebglPow.height * n
              const calcTime = (Date.now() - start) / 1000
              toast("Successfully generated PoW at " + helpers.addCommas(String(Math.round(hashes / calcTime / 1000))) +" khash/s", helpers.getToast(helpers.toastType.SUCCESS_AUTO))
              this.setState({
                generating: false
              })
              this.workChange(work)
          },
          n => {
            toast("Calculated " + helpers.addCommas(n*window.NanoWebglPow.width * window.NanoWebglPow.height) + " hashes...", helpers.getToast(helpers.toastType.SUCCESS_AUTO))
          }
        )
      }
      catch(error) {
        if(error.message === 'webgl2_required') {
          toast("WebGL 2 is required to generate work.", helpers.getToast(helpers.toastType.ERROR))
        }
        else if(error.message === 'invalid_hash') {
          toast("Block hash must be 64 character hex string", helpers.getToast(helpers.toastType.ERROR))
        }
        else {
          toast("An unknown error occurred while generating PoW", helpers.getToast(helpers.toastType.ERROR))
          console.log("An unknown error occurred while generating PoW" + error)
        }
        this.setState({
          generating: false
        })
        return
      }
    }
    else {
      toast("Need a valid input hash to generate work", helpers.getToast(helpers.toastType.ERROR_AUTO_LONG))
    }
  }

  workChange(hash) {
    if (!nano.validateWork({blockHash:this.state.workHash, work:hash})) {
      toast("The output work did not validate against input hash.", helpers.getToast(helpers.toastType.ERROR_AUTO_LONG))
      this.setState({
        work: '',
        validWork: false
      })
      return
    }
    this.setState({
      work: hash,
      validWork: true
    },
    function() {
      this.updateQR()
      this.appendOutput()
    })
  }

  // add a new line to output text field
  appendOutput() {
    let output = {hash: this.state.workHash, work: this.state.work}
    var saved = this.state.savedOutput
    saved.push(output)
    this.setState({
      output: JSON.stringify(saved, null, 2),
      savedOutput: saved
    })
  }

  render() {
    return (
      <div>
        <p>Generate Proof of Work (PoW) from Input Hash</p>
        <ul>
          <li>The generator is using the GPU via webGL which is not supported in all browsers</li>
          <li>Higher GPU Load is not always faster</li>
        </ul>

        <InputGroup size="sm" className='mb-3'>
          <InputGroup.Prepend className='narrow-prepend-2'>
            <InputGroup.Text id="workHash">
              Work Hash
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl id="workHash" aria-describedby="workHash" value={this.state.workHash} disabled={this.state.generating} title="64 char hex hash for generating work." placeholder="ABC123... or abc123..." maxLength="64" onChange={this.handleWorkHashChange} autoComplete="off"/>
          <InputGroup.Append>
            <Button variant="outline-secondary" className="fas fa-times-circle" value='workHash' disabled={this.state.generating} onClick={this.clearText}></Button>
            <Button variant="outline-secondary" className="fas fa-copy" value={this.state.workHash} onClick={helpers.copyText}></Button>
            <Button variant="outline-secondary" className={this.state.qrActive === 'workHash' ? "btn-active fas fa-qrcode" : "fas fa-qrcode"} value='workHash' onClick={this.handleQRChange}></Button>
          </InputGroup.Append>
        </InputGroup>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Prepend className='narrow-prepend-2'>
            <InputGroup.Text id="pow">
              PoW
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl id="pow" aria-describedby="pow" value={this.state.work} disabled title="The generated proof of work for given input." placeholder="ABC123... or abc123..." maxLength="16" autoComplete="off"/>
          <InputGroup.Append>
            <Button variant="outline-secondary" className="fas fa-times-circle" value='work' onClick={this.clearText}></Button>
            <Button variant="outline-secondary" className="fas fa-copy" value={this.state.work} onClick={helpers.copyText}></Button>
            <Button variant="outline-secondary" className={this.state.qrActive === 'work' ? "btn-active fas fa-qrcode" : "fas fa-qrcode"} value='work' onClick={this.handleQRChange}></Button>
          </InputGroup.Append>
        </InputGroup>

        <InputGroup size="sm" className="mb-3">
          <div className="gpu-load-title">GPU Load:</div>
          <div className="form-check form-check-inline index-checkbox">
            <input className="form-check-input" type="radio" id="send-check" value="0" checked={this.state.selectedOption === "0"} onChange={this.handleOptionChange}/>
            <label className="form-check-label" htmlFor="send-check">1</label>
          </div>
          <div className="form-check form-check-inline index-checkbox">
            <input className="form-check-input" type="radio" id="receive-check" value="1" checked={this.state.selectedOption === "1"} onChange={this.handleOptionChange}/>
            <label className="form-check-label" htmlFor="receive-check">2</label>
          </div>
          <div className="form-check form-check-inline index-checkbox">
            <input className="form-check-input" type="radio" id="open-check" value="2" checked={this.state.selectedOption === "2"} onChange={this.handleOptionChange}/>
            <label className="form-check-label" htmlFor="open-check">4</label>
          </div>
          <div className="form-check form-check-inline index-checkbox">
            <input className="form-check-input" type="radio" id="change-check" value="3" checked={this.state.selectedOption === "3"} onChange={this.handleOptionChange}/>
            <label className="form-check-label" htmlFor="change-check">8</label>
          </div>
          <div className="form-check form-check-inline index-checkbox">
            <input className="form-check-input" type="radio" id="change-check" value="4" checked={this.state.selectedOption === "4"} onChange={this.handleOptionChange}/>
            <label className="form-check-label" htmlFor="change-check">16</label>
          </div>
          <div className="form-check form-check-inline index-checkbox">
            <input className="form-check-input" type="radio" id="change-check" value="5" checked={this.state.selectedOption === "5"} onChange={this.handleOptionChange}/>
            <label className="form-check-label" htmlFor="change-check">32</label>
          </div>
          <div className="form-check form-check-inline index-checkbox">
            <input className="form-check-input" type="radio" id="change-check" value="6" checked={this.state.selectedOption === "6"} onChange={this.handleOptionChange}/>
            <label className="form-check-label" htmlFor="change-check">64</label>
          </div>
        </InputGroup>

        <InputGroup size="sm" className="mb-3">
          <Button className="btn-medium" variant="primary" onClick={this.generateWork} disabled={!this.state.validWorkHash || this.state.generating}>Generate PoW</Button>
          <Button className="btn-medium" variant="primary" onClick={this.sample}>Sample</Button>
          <Button className="btn-medium" variant="primary" onClick={this.clearOutput}>Clear</Button>
        </InputGroup>

        <InputGroup size="sm" className='mb-3'>
          <InputGroup.Prepend className='narrow-prepend-2'>
            <InputGroup.Text id="output">
              JSON
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl id="output-area" aria-describedby="output" as="textarea" rows="6" placeholder="" value={this.state.output} readOnly/>
          <InputGroup.Append>
            <Button variant="outline-secondary" className="fas fa-copy" onClick={helpers.copyOutput}></Button>
          </InputGroup.Append>
        </InputGroup>

        <div className={ this.state.qrHidden ? "hidden" : ""}>
          <div className={helpers.qrClassesContainer[this.state.qrState]}>
            <QrImageStyle className={helpers.qrClassesImg[this.state.qrState]} content={this.state.qrContent} onClick={this.double} title="Click to toggle size" size={this.state.qrSize} />
          </div>
        </div>
      </div>
    )
  }
}
export default WorkGeneratorTool
