import Footer from './footer'
import '../css/about.css'

export default function About() {
  return (
    <>
      <div
        className='background_image opaque'
        style={{ background: 'black' }}
      />
      <main className='about_main main'>
        <div className='about_container'>
          <p class='about_intro_text'>
            <i>
              <b>Our Story</b>
            </i>
            <br />
            <br />
            Being Vietnamese people, we take pride in our culture, cuisine, and
            identity. Our coffee has affirmed a reputation in the global market;
            our brewing methods result in a uniquely fragrant and strong coffee
            flavour. Grabbing a cup of coffee at the street vendor is a daily
            routine for many Vietnamese people, and a significant part of our
            identity.
            <br />
            <br />
            We observed the difficulty for the Vietnamese community in Calgary
            to enjoy authentic Vietnamese coffee, and embraced a vision to
            launch the first Vietnamese coffee shop in Calgary. Instead of
            solely offering unique coffee, we hope to also bring our cultural
            beauty; the interior is carefully designed to blend western modern
            architecture with Vietnamese architecture, and we pour our heart and
            soul into each drink. We look forward to meeting you!
            <br />
            <br />
            <span class='about_brand_name about_align_right'>
              <i>- Xin Chao Staff</i>
            </span>
            <br />
            <br />
            <br />
            <i>
              <b>Why "Xin Chao"? </b>
            </i>{' '}
            <br />
            <br />
            Since <span class='about_brand_name'> Xin Chao</span> is the first
            shop that serves a traditional, unique Vietnamese coffee taste in
            Calgary, we looked for a Vietnamese word that conveys our enthusiasm
            over this exciting new opening. "Xin Chao" means "hello" in English,
            and is convenient for non-Vietnamese people to pronuounce. So
            <span class='about_brand_name'>"Xin Chao Coffee"</span> is our way
            of saying
            <span class='about_brand_name'>"Hello!"</span> to our new, current,
            and future customers!
          </p>
        </div>
        <Footer />
      </main>
    </>
  )
}
