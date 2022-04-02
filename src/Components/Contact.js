import React, { Component } from 'react';
import { css } from "@emotion/react";
import SyncLoader from "react-spinners/SyncLoader";
import emailjs from '@emailjs/browser';
import{ init } from '@emailjs/browser';
import axios from 'axios';
import GitHubCalendar from 'react-github-calendar';
import './contact.scss'
// Import Images
import JsIcon from './../Attachments/js.png'
import HtmlIcon from './../Attachments/html.png'
import CssIcon from './../Attachments/css.png'
import VueIcon from './../Attachments/vue.png'
import ReactIcon from './../Attachments/react.png'
init("h-Rx03CSW9Byu440m");

const override = css`
   display: block;
   margin: 0 auto;
   display: flex;
   justify-content: center;
`;

const selectLastHalfYear = contributions => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const shownMonths = 6;

  return contributions.filter(day => {
    const date = new Date(day.date);
    const monthOfDay = date.getMonth();

    return (
      date.getFullYear() === currentYear &&
      monthOfDay > currentMonth - shownMonths &&
      monthOfDay <= currentMonth
    );
  });
};

class Contact extends Component {
   constructor(props) {
      super(props);
      this.state = {
         contact: {
            name: '',
            email: '',
            subject: '',
            message: ''
         },
         hideForm: false,
         profile: {},
         lastProjects: []
      };
   }
   handleChange (e, input) {
      let contact
      contact = {...this.state.contact}
      contact[e.target.id] = e.target.value
      this.setState({ contact: contact })
   }

   sendEmail = async (e) => {
      this.setState({ 
         isLoading: true
      })
      console.log('===> Debug0: ')
      console.log('===> Debug1: ', process.env.REACT_APP_EMAIL_SERVICE_ID,process.env.REACT_APP_EMAIL_TEMPLATE_ID, this.state.contact)
      try {
         console.log('===> Debug2: ', process.env.REACT_APP_EMAIL_SERVICE_ID,process.env.REACT_APP_EMAIL_TEMPLATE_ID, this.state.contact)
         emailjs.send(process.env.REACT_APP_EMAIL_SERVICE_ID,process.env.REACT_APP_EMAIL_TEMPLATE_ID, this.state.contact);
         this.setState({ 
            isLoading: false,
            successfulSent: true,
            hideForm: true
         })
      } catch (error) {
         console.log('===> Error: ', error)
         this.setState({ 
            isLoading: false,
            successfulSent: false,
            errorMessage: JSON.stringify(error)
         })
      }
   };

   componentDidMount () {
      this.loadGithubStats()
   }

   async loadGithubStats () {
      try {
         let response = await axios.get('https://api.github.com/users/Diogo107/repos')
         this.setState({
            profile: {
               username: response.data.login, 
               avatar: response.data.avatar_url, 
               url: response.data.url, 
               followers: response.data.followers, 
               following: response.data.following, 
               public_repos: response.data.public_repos, 
            },
            lastProjects: response.data.sort(function(a,b){
               return new Date(b.updated_at) - new Date(a.updated_at);
            }).slice(0, 3)

         })
      } catch (error) {
         console.log(error)
      }
   }

  render() {

    if(this.props.data){
      var name = this.props.data.name;
      var city = this.props.data.address.city;
      var country = this.props.data.address.country;
      var phone= this.props.data.phone;
      var email = this.props.data.email;
      var message = this.props.data.contactmessage;
    }
    return (
      <section id="contact">
         <div className="row section-head">

            <div className="two columns header-col">

               <h1><span>Get In Touch.</span></h1>

            </div>

            <div className="ten columns">

                  <p className="lead">{message}</p>

            </div>

         </div>

         <div className="row">
            <div className="eight columns">

               {!this.state.hideForm &&
                  <form id="contactForm" name="contactForm" >
                     <fieldset>

                        <div>
                           <label htmlFor="contactName">Name <span className="required"></span></label>
                           <input type="text" defaultValue="" size="35" id="name" name="contactName" onChange={e => this.handleChange(e, 'name')}/>
                        </div>

                        <div>
                           <label htmlFor="contactEmail">Email <span className="required">*</span></label>
                           <input type="email" defaultValue="" size="35" id="email" name="contactEmail" required onChange={e => this.handleChange(e, 'email')}/>
                        </div>

                        <div>
                           <label htmlFor="contactSubject">Subject</label>
                           <input type="text" defaultValue="" size="35" id="subject" name="contactSubject" onChange={e => this.handleChange(e, 'subject')}/>
                        </div>

                        <div>
                           <label htmlFor="contactMessage">Message <span className="required">*</span></label>
                           <textarea cols="50" rows="15" id="message" name="contactMessage" required onChange={ e => this.handleChange(e, 'message')}></textarea>
                        </div>

                        <div>
                        {this.state.isLoading ?
                           <SyncLoader css={override} size={15} color={"#F06000"} loading={this.state.isLoading} speedMultiplier={0.75} />
                        :
                           <button className="submit" type='button' onClick={(e) => this.sendEmail(e)} disabled={!this.state.contact.email.length || !this.state.contact.message.length}>Submit</button>
                        }
                        </div>
                     </fieldset>
				      </form>
               }
               {this.state.errorMessage && 
                  <div id="message-warning"> Error</div>
               }
               {this.state.successfulSent && 
                  <div id="message-success">
                     <i className="fa fa-check"></i>Your message was sent, thank you!<br />
                  </div>
               }
           </div>


            <aside className="four columns footer-widgets">
               <div className="widget widget_contact">

					   <h4>Address and Phone</h4>
					   <p className="address">
						   {name}<br />
						   {city}, {country}<br />
						   <span>{phone}</span><br />
						   <span>{email}</span>
					   </p>
				   </div>

               <div className="widget widget_tweets">
                  <h4 className="widget-title">Last Contributions</h4>
                  <GitHubCalendar username="diogo107" blockSize={21} color={'#F06000'} transformData={selectLastHalfYear} />
                  
                  <ul id="twitter">
                     {this.state.lastProjects.map( (e, index) => {
                        let icon
                        switch (e.language) {
                           case 'CSS':
                              icon = CssIcon
                              break
                           case 'HTML':
                              icon = HtmlIcon
                              break
                           case 'Vue':
                              icon = VueIcon
                              break
                           case 'React':
                              icon = ReactIcon
                              break
                           default:
                              icon = JsIcon
                              break
                        }
                        return (
                           <li key={index} className='last__contribution--item'>
                              <a href={e.html_url} >
                                 <img src={icon} alt={e.language} />
                                 <span>
                                    <h6>{e.name}</h6>
                                    <p>{e.description}</p>
                                 </span>
                              </a>
                           </li>
                        )
                     })}
                  </ul>
		         </div>
            </aside>
      </div>
   </section>
    );
  }
}

export default Contact;
