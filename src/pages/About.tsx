import { Link } from 'react-router-dom'
import MyButton from '../components/MyButton'
import '../App.css'

export default function About() {
  return (
    <>
      <section id="center">
        <div>
          <h1>About Page</h1>
          <p>这是一个关于页面的示例</p>
        </div>

        <Link to="/">
          <MyButton className="counter">返回首页</MyButton>
        </Link>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}
