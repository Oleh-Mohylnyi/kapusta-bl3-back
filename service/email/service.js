import Mailgen from 'mailgen'

class EmailService {
  constructor(env, sender) {
    this.sender = sender
    switch (env) {
      case 'development':
        this.link = 'http://localhost:4000'
        break
      case 'test':
        this.link = 'http://localhost:4000'
        break
      case 'production':
        this.link = 'https://kapusta-smart-finances.herokuapp.com'
        break
      default:
        this.link = 'http://localhost:4000'
    }
  }

  createEmailTemplate(username, verifyToken) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Kapu$ta smart finances',
        link: this.link,
      },
    })

    const email = {
      body: {
        name: username,
        intro: "Hey! We're glad you signed up!",
        action: {
          instructions: 'To get started, please click here:',
          button: {
            color: '#ff751d', 
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
        outro: 'PS: if you do not register an account on Kapu$ta smart finances, please ignore this letter',
      },
    }
    return mailGenerator.generate(email)
  }

  async sendVerifyEmail(email, username, verifyToken) {
    const emailBody = this.createEmailTemplate(username, verifyToken)
    const msg = {
      to: email,
      subject: 'Mail verification by Kapu$ta',
      html: emailBody,
    }
    try {
      const result = await this.sender.send(msg)
      // console.log(result)
      return true
    } catch (error) {
      console.error(error.message)
      return false
    }
  }
}

export default EmailService
