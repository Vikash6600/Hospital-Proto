import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  ArrowDown, ArrowRight, ArrowUpRight, Activity, CalendarDays, Check,
  ChevronDown, Clock3, HeartPulse, MapPin, Menu, MoveRight, Plus,
  Search, ShieldCheck, Sparkles, Stethoscope, X,
} from 'lucide-react'

const doctors = [
  { name: 'Dr. Maya Desai', field: 'Cardiology', image: 'photo-1559839734-2b71ea197ec2', note: 'Heart & vascular care' },
  { name: 'Dr. James Okafor', field: 'Orthopedics', image: 'photo-1612349317150-e413f6a5b16d', note: 'Bone & joint' },
  { name: 'Dr. Elena Park', field: "Women's health", image: 'photo-1594824476967-48c8b964273f', note: "Women's health" },
]
const specialties = [
  { name: 'Heart & vascular', detail: 'Specialist care to keep you moving forward.', icon: HeartPulse, color: 'sage', index: '01' },
  { name: "Women's health", detail: 'Care that listens at every stage.', icon: Sparkles, color: 'rose', index: '02' },
  { name: 'Bone & joint', detail: 'Helping you get back to what you love.', icon: Activity, color: 'blue', index: '03' },
  { name: 'Family medicine', detail: 'A trusted partner for everyday health.', icon: Plus, color: 'lime', index: '04' },
]
const faqContent = {
  Patients: [
    ['What should I bring to my first appointment?', 'Bring a photo ID, a list of current medications, and any questions you would like to discuss. Our team can help with the rest.'],
    ['Can I choose a specific doctor?', 'Yes. You can select a doctor in the booking demo. In a live version, available times would come from the hospital scheduling system.'],
    ['How do I prepare for a visit?', 'Preparation varies by service. The hospital team will share any specific instructions when your visit is confirmed.'],
  ],
  Visitors: [
    ['When can I visit a patient?', 'General visiting hours are Monday to Saturday, 8am–6pm. Please check with the hospital team for unit-specific guidance.'],
    ['Where can I park?', 'Visitor parking is available near the main entrance. Staff at reception can direct you to accessible spaces.'],
    ['Where is the main entrance?', 'The main entrance is on Willow Park Road, with reception just inside to help you find your way.'],
  ],
  Appointments: [
    ['How do I request an appointment?', 'Choose a service or doctor, select a sample time, and enter fictional contact details in the booking demo.'],
    ['Can I choose a specific doctor?', 'Yes. Use the doctor cards to start a sample request with that clinician selected.'],
    ['Can I change or cancel a visit?', 'This concept demo does not create real appointments. A live site would provide the hospital’s rescheduling instructions.'],
  ],
}

function Brand({ light = false }) {
  return <a className={`brand ${light ? 'brand-light' : ''}`} href="#top" aria-label="Asterwell Hospital home"><span className="brand-mark"><i /><b /></span><span className="brand-type">asterwell<small>HOSPITAL</small></span></a>
}
function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}
function Eyebrow({ children, light = false }) {
  return <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span />{children}</div>
}
function BookingDialog({ open, onOpenChange, initialDoctor, initialService }) {
  const [step, setStep] = useState(1)
  const [service, setService] = useState('')
  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState('Tue, Nov 3')
  const [time, setTime] = useState('9:30 AM')
  const [patient, setPatient] = useState({ first: '', last: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)
  const availableDates = ['Tue, Nov 3', 'Wed, Nov 4', 'Thu, Nov 5', 'Fri, Nov 6']
  const close = value => { onOpenChange(value); if (!value) { setTimeout(() => { setStep(1); setSubmitted(false) }, 250) } }
  const onNext = () => setStep(value => Math.min(value + 1, 3))
  const patientName = `${patient.first} ${patient.last}`.trim()
  useEffect(() => {
    if (open) { setService(initialService || ''); setDoctor(initialDoctor || '') }
  }, [open, initialDoctor, initialService])
  const reviewDetails = () => {
    const fields = [...document.querySelectorAll('.booking-dialog .form-step input')]
    for (const field of fields) if (!field.reportValidity()) return
    setStep(3)
  }

  return <Dialog.Root open={open} onOpenChange={close}>
    <Dialog.Portal>
      <Dialog.Overlay className="dialog-overlay" />
      <Dialog.Content className="booking-dialog">
        <div className="dialog-visual">
          <div className="dialog-brand"><Brand light /></div>
          <div className="dialog-visual-copy"><Eyebrow light>YOUR NEXT STEP</Eyebrow><h2>Let’s find a time<br />that works <em>for you.</em></h2><p>A few quick details and you’ll be on your way.</p></div>
          <div className="dialog-visual-foot"><Sparkles size={15} /> A little more time for what matters.</div>
          <Dialog.Close className="dialog-close dialog-close-mobile" aria-label="Close booking"><X size={19} /></Dialog.Close>
        </div>
        <div className="dialog-form-wrap">
          <Dialog.Close className="dialog-close dialog-close-desktop" aria-label="Close booking"><X size={18} /></Dialog.Close>
          <div className="booking-progress">{['YOUR VISIT', 'YOUR DETAILS', 'CONFIRM'].map((label, i) => <div className={`progress-item ${step === i + 1 ? 'active' : ''} ${step > i + 1 || submitted ? 'complete' : ''}`} key={label}><i>{step > i + 1 || submitted ? <Check size={11} /> : i + 1}</i><span>{label}</span></div>)}</div>
          <AnimatePresence mode="wait" initial={false}>
            {!submitted && step === 1 && <motion.div key="visit" className="form-step" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
              <Eyebrow>STEP 1 OF 3</Eyebrow><h3>Choose your visit</h3><p className="form-subtitle">Tell us what kind of care you’re looking for.</p>
              <label className="field-label" htmlFor="service">Service or specialty</label><select id="service" value={service} onChange={e => setService(e.target.value)}><option value="">Choose a service</option>{['Family medicine', 'Heart & vascular care', "Women's health", 'Bone & joint', 'General consultation'].map(x => <option key={x}>{x}</option>)}</select>
              <label className="field-label" htmlFor="doctor">Preferred doctor <span>optional</span></label><select id="doctor" value={doctor || initialDoctor || ''} onChange={e => setDoctor(e.target.value)}><option value="">First available</option>{doctors.map(x => <option key={x.name}>{x.name}</option>)}</select>
              <label className="field-label">Choose a day</label><div className="date-picker">{availableDates.map((value, i) => <button className={date === value ? 'selected' : ''} type="button" onClick={() => setDate(value)} key={value}><small>{value.split(',')[0].slice(0,3).toUpperCase()}</small><strong>{String(i + 3).padStart(2, '0')}</strong><small>NOV</small></button>)}</div>
              <label className="field-label">Available times</label><div className="time-picker">{['9:30 AM', '11:15 AM', '1:45 PM', '3:00 PM'].map(value => <button className={time === value ? 'selected' : ''} type="button" onClick={() => setTime(value)} key={value}>{value}</button>)}</div>
              <Button className="full-button" onClick={() => service && onNext()} disabled={!service}>Continue <ArrowRight size={15} /></Button>
            </motion.div>}
            {!submitted && step === 2 && <motion.div key="details" className="form-step" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
              <Eyebrow>STEP 2 OF 3</Eyebrow><h3>Your details</h3><p className="form-subtitle">How can our team reach you about this request?</p>
              <div className="field-pair"><div><label className="field-label" htmlFor="first">First name</label><input id="first" required placeholder="Your first name" value={patient.first} onChange={e => setPatient({ ...patient, first: e.target.value })} /></div><div><label className="field-label" htmlFor="last">Last name</label><input id="last" required placeholder="Your last name" value={patient.last} onChange={e => setPatient({ ...patient, last: e.target.value })} /></div></div>
              <label className="field-label" htmlFor="email">Email address</label><input id="email" type="email" required placeholder="you@example.com" value={patient.email} onChange={e => setPatient({ ...patient, email: e.target.value })} />
              <label className="field-label" htmlFor="phone">Phone number</label><input id="phone" type="tel" required placeholder="(555) 000-0000" value={patient.phone} onChange={e => setPatient({ ...patient, phone: e.target.value })} />
              <div className="demo-note"><ShieldCheck size={15} /> Concept demo—please use fictional contact details.</div>
              <div className="form-actions"><Button variant="ghost" onClick={() => setStep(1)}>← Back</Button><Button onClick={reviewDetails}>Review request <ArrowRight size={15} /></Button></div>
            </motion.div>}
            {!submitted && step === 3 && <motion.div key="review" className="form-step" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
              <Eyebrow>STEP 3 OF 3</Eyebrow><h3>Review your request</h3><p className="form-subtitle">Take a moment to check the details.</p>
              <div className="review-panel">{[['SERVICE', service], ['DOCTOR', doctor || 'First available'], ['DATE & TIME', `${date} · ${time}`], ['PATIENT', patientName], ['CONTACT', patient.email]].map(([a,b]) => <div key={a}><small>{a}</small><strong>{b}</strong></div>)}</div>
              <p className="demo-disclaimer">Demo only: submitting will not contact the hospital or create a real appointment.</p><div className="form-actions"><Button variant="ghost" onClick={() => setStep(2)}>← Edit details</Button><Button onClick={() => setSubmitted(true)}>Send sample request <ArrowUpRight size={15} /></Button></div>
            </motion.div>}
            {submitted && <motion.div key="success" className="form-step success-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><div className="success-mark"><Check size={24} /></div><Eyebrow>REQUEST PREVIEWED</Eyebrow><h3>That’s a good<br /><em>first step.</em></h3><p className="form-subtitle">Your sample request is ready. In the finished website, the hospital team would follow up to confirm your visit.</p><div className="success-recap">{service} · {date} at {time}<br /><small>Sample request only — no appointment was sent.</small></div><Button className="full-button" onClick={() => close(false)}>Back to the website <ArrowUpRight size={15} /></Button></motion.div>}
          </AnimatePresence>
          <div className="dialog-footnote"><Sparkles size={12} /> Asterwell Hospital concept · Sample content</div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}

function App() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [requestedDoctor, setRequestedDoctor] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [faqOpen, setFaqOpen] = useState(0)
  const [activeTab, setActiveTab] = useState('Patients')
  const [subscribed, setSubscribed] = useState(false)
  const [requestedService, setRequestedService] = useState('')
  const filteredDoctors = useMemo(() => doctors.filter(d => `${d.name} ${d.field} ${d.note}`.toLowerCase().includes(query.toLowerCase())), [query])
  const faqs = faqContent[activeTab]
  const book = (doctor = '', service = '') => { setRequestedDoctor(doctor); setRequestedService(service); setBookingOpen(true) }
  useEffect(() => {
    const handleShortcut = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); document.getElementById('doctorSearch')?.focus()
      }
    }
    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  return <>
    <div className="topline"><div className="topline-inner"><span className="open-dot" /> HERE WHEN YOU NEED US <span className="topline-divider">·</span> 24/7 EMERGENCY CARE <a href="#contact">GET HELP NOW <ArrowUpRight size={12} /></a><div className="topline-right"><a href="#contact">Visitor information</a><span>EN <ChevronDown size={11} /></span></div></div></div>
    <header className="header" id="top"><div className="header-inner"><Brand /><button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button><nav className={menuOpen ? 'nav open' : 'nav'}><a href="#care" onClick={() => setMenuOpen(false)}>Our care</a><a href="#doctors" onClick={() => setMenuOpen(false)}>Find a doctor</a><a href="#about" onClick={() => setMenuOpen(false)}>About us</a><a href="#visit" onClick={() => setMenuOpen(false)}>Plan your visit</a><Button onClick={() => book()}>Book a visit <ArrowUpRight size={15} /></Button></nav></div></header>

    <main>
      <section className="hero-wrap">
        <div className="hero-copy"><Eyebrow>CARE THAT FEELS CLOSER</Eyebrow><h1>Good health<br />starts with <em>being heard.</em></h1><p>Expert care, thoughtful people, and a little more time for what matters to you.</p><div className="hero-actions"><Button onClick={() => book()}>Find your care <ArrowUpRight size={15} /></Button><a className="under-link" href="#care">Explore our services <ArrowDown size={14} /></a></div><div className="social-proof"><div className="avatar-stack">{doctors.map(d => <img key={d.name} src={`https://images.unsplash.com/${d.image}?w=80&h=80&fit=crop&crop=faces`} alt="" />)}</div><div><strong>Care led by people</strong><span>Here for every step of your health journey</span></div></div></div>
        <div className="hero-media"><img src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1500&q=88" alt="Doctor speaking with a patient in a bright clinic"/><div className="hero-gradient"/><div className="hero-float-card"><span className="float-icon"><Sparkles size={17}/></span><div><strong>Care, made personal.</strong><small>Every person. Every time.</small></div></div><div className="hero-media-index"><span>01</span><i/><span>04</span></div><div className="hero-badge"><span>AW</span></div></div>
        <div className="hero-base"><span>THOUGHTFUL CARE FOR EVERY CHAPTER</span><span>SCROLL TO EXPLORE <ArrowDown size={12}/></span><span>01 / 04</span></div>
      </section>

      <section className="quick-panel"><div className="quick-title">HOW CAN WE<br/>HELP YOU TODAY?</div>{[{icon:Stethoscope,title:'Explore our',bold:'services',href:'#care'},{icon:Search,title:'Meet our',bold:'specialists',href:'#doctors'},{icon:MapPin,title:'Plan your',bold:'visit',href:'#visit'}].map(({icon:Icon,title,bold,href}) => <a className="quick-action" href={href} key={bold}><span className="quick-icon"><Icon size={17}/></span><span>{title}<strong>{bold}</strong></span><ArrowUpRight size={14}/></a>)}<button className="quick-action quick-action-book" onClick={() => book()}><span className="quick-icon"><CalendarDays size={16}/></span><span>Make an<strong>appointment</strong></span><ArrowUpRight size={14}/></button></section>

      <section className="section care-section" id="care"><div className="section-heading"><div><Eyebrow>CARE, YOUR WAY</Eyebrow><h2>All the care you need.<br/><em>All in one place.</em></h2></div><p>From your first question to your next chapter, find expert care shaped around you.</p></div><div className="care-grid">{specialties.map(({name,detail,icon:Icon,color,index}) => { const serviceName = name === 'Heart & vascular' ? 'Heart & vascular care' : name; return <button className="care-card" key={name} onClick={() => book('', serviceName)}><div className="care-card-head"><span>{index} / {name.toUpperCase()}</span><span className="circle-arrow"><ArrowUpRight size={15}/></span></div><div className={`care-illustration ${color}`}><div className="illustration-ring ring-one"/><div className="illustration-ring ring-two"/><Icon size={55} strokeWidth={1.15}/><small>ASTERWELL · SPECIALTY CARE</small></div><div className="care-card-copy"><h3>{name}</h3><p>{detail}</p></div></button> })}</div><div className="section-foot"><span>01—04 &nbsp; OUR SPECIALTIES</span><a className="under-link" href="#doctors">View all services <ArrowUpRight size={14}/></a></div></section>

      <section className="story-section" id="about"><div className="story-photo"><img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1100&q=85" alt="Clinician offering attentive care"/><div className="story-sticker"><Sparkles size={19}/><strong>Care is a<br/>conversation.</strong><small>We make time to listen.</small></div></div><div className="story-copy"><Eyebrow>A DIFFERENT KIND OF CARE</Eyebrow><h2>Medicine is personal.<br/><em>We treat it that way.</em></h2><p className="story-lead">Good care starts long before a prescription. It starts with a question, a kind word, and a team that sees the whole person.</p><p>At Asterwell, we bring skilled clinicians and thoughtful support together—so you can feel confident about your care and the people beside you.</p><a className="outline-link" href="#faq">Get to know us <ArrowUpRight size={15}/></a><div className="promise"><span>OUR PROMISE</span><strong>Here for you. All the way.</strong></div></div></section>

      <section className="section doctors-section" id="doctors"><div className="section-heading"><div><Eyebrow>GOOD PEOPLE. GOOD CARE.</Eyebrow><h2>Meet the people<br/><em>in your corner.</em></h2></div><div className="doctor-search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search doctors or specialties" aria-label="Search doctors or specialties"/><span>⌘ K</span></div></div><div className="doctor-grid">{filteredDoctors.map((doctor,i) => <motion.article className="doctor-card" key={doctor.name} layout initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.06}}><div className="doctor-image"><img src={`https://images.unsplash.com/${doctor.image}?auto=format&fit=crop&w=800&q=85`} alt={doctor.name}/><span className="doctor-badge">{doctor.field.toUpperCase()}</span><button className="doctor-cta" aria-label={`Book with ${doctor.name}`} onClick={() => book(doctor.name)}><ArrowUpRight size={17}/></button></div><div className="doctor-info"><div><h3>{doctor.name}</h3><p>{doctor.note}</p></div><span className="online-dot" title="Accepting sample appointments"/></div></motion.article>)}</div>{!filteredDoctors.length && <div className="empty-state">No matching doctors. Try another name or specialty.</div>}<div className="doctors-foot"><span>PROFILES AND AVAILABILITY SHOWN FOR CONCEPT ONLY</span><a className="under-link" href="#doctors">Meet our team <ArrowUpRight size={14}/></a></div></section>

      <section className="visit-section" id="visit"><div className="visit-copy"><Eyebrow light>YOUR VISIT, MADE EASIER</Eyebrow><h2>From “I need care”<br/>to <em>“I’m in good hands.”</em></h2><p>We’ve thought through the little things, so you can focus on feeling better.</p><div className="visit-steps">{[['01','Find the right care','Explore services or find a specialist.'],['02','Choose a time that works','Pick from sample appointment times.'],['03','We’ll take it from here','Our team will help with next steps.']].map(([n,title,desc]) => <div key={n}><span>{n}</span><strong>{title}</strong><small>{desc}</small></div>)}</div><Button variant="lime" onClick={() => book()}>Start booking <ArrowUpRight size={15}/></Button></div><div className="visit-image"><img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1100&q=85" alt="Welcoming hospital reception area"/><div className="visit-caption"><Sparkles size={16}/><div><strong>Here for every step.</strong><small>Thoughtful care, close to home.</small></div></div></div></section>

      <section className="faq-section" id="faq"><div className="faq-heading"><Eyebrow>A FEW HELPFUL THINGS</Eyebrow><h2>Questions, meet<br/><em>good answers.</em></h2><p>Everything you need to feel ready for your visit.</p><div className="faq-tabs">{['Patients','Visitors','Appointments'].map(tab => <button className={activeTab===tab?'active':''} key={tab} onClick={() => { setActiveTab(tab); setFaqOpen(0) }}>{tab}</button>)}</div></div><div className="faq-list">{faqs.map(([question,answer],i) => <div className={`faq-item ${faqOpen===i?'expanded':''}`} key={question}><button onClick={() => setFaqOpen(faqOpen===i?-1:i)} aria-expanded={faqOpen===i}><span>{question}</span><span className="faq-toggle">{faqOpen===i?'−':'+'}</span></button><AnimatePresence initial={false}>{faqOpen===i && <motion.div className="faq-answer" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}><p>{answer}</p></motion.div>}</AnimatePresence></div>)}<a href="#contact" className="faq-more">Browse patient information <ArrowUpRight size={14}/></a></div></section>

      <section className="location-section" id="contact"><div className="location-copy"><Eyebrow>COME SAY HELLO</Eyebrow><h2>Right here,<br/><em>when you need us.</em></h2><p>Easy to find. Easier to reach. Our team is ready to help you plan your visit.</p><div className="location-details"><div><span><MapPin size={16}/></span><p><small>FIND US</small><strong>24 Willow Park Road<br/>Brookfield, CA 94005</strong></p></div><div><span><Clock3 size={16}/></span><p><small>OPEN WHEN YOU NEED US</small><strong>Emergency care · 24 hours<br/>Main clinic · Mon–Sat, 8am–6pm</strong></p></div><div><span><MoveRight size={16}/></span><p><small>GIVE US A CALL</small><strong>(555) 014-2080</strong></p></div></div><a className="under-link" href="https://maps.google.com/?q=24+Willow+Park+Road+Brookfield+CA" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={14}/></a></div><div className="map-card"><div className="map-lines"/><span className="map-label label-a">WILLOW PARK</span><span className="map-label label-b">MEADOW LANE</span><div className="map-pin"><Sparkles size={18}/><div><strong>ASTERWELL HOSPITAL</strong><small>24 Willow Park Road</small></div></div><span className="map-caption">BROOKFIELD · CALIFORNIA</span></div></section>

      <section className="closing-cta"><div><Eyebrow light>LET’S TAKE THE NEXT STEP</Eyebrow><h2>We’re here when<br/><em>you’re ready.</em></h2></div><Button variant="lime" onClick={() => book()}>Book an appointment <ArrowUpRight size={16}/></Button><span className="cta-orbit">✳</span></section>
    </main>
    <footer className="footer"><div className="footer-top"><div className="footer-brand-col"><Brand light/><p>Thoughtful care for every<br/>chapter of your health.</p><div className="footer-social"><a href="#contact">ig</a><a href="#contact">f</a><a href="#contact">in</a></div></div><div className="footer-links"><div><small>EXPLORE</small><a href="#care">Our care</a><a href="#doctors">Find a doctor</a><a href="#about">About us</a></div><div><small>NEED A HAND?</small><a href="#visit">Plan your visit</a><a href="#contact">Contact & directions</a><a href="#faq">Patient information</a></div><div><small>GET IN TOUCH</small><a href="tel:+15550142080">(555) 014-2080</a><a href="#contact">24 Willow Park Road<br/>Brookfield, CA 94005</a></div></div><div className="footer-news"><div><small>NOTES FROM ASTERWELL</small><strong>A little care in your inbox.</strong></div><form onSubmit={e=>{e.preventDefault(); setSubscribed(true); e.currentTarget.reset()}}><input type="email" aria-label="Email address" placeholder={subscribed ? 'Thanks for joining' : 'Your email address'} required/><button aria-label="Subscribe to Asterwell updates"><ArrowRight size={15}/></button></form><span aria-live="polite">{subscribed ? 'Thanks for joining us. This demo did not send your address.' : 'Health notes, hospital updates, and community stories.'}</span></div></div><div className="footer-bottom"><span>© 2026 Asterwell Hospital <b>· CONCEPT DEMO — SAMPLE CONTENT</b></span><span>Privacy &nbsp;&nbsp; Accessibility &nbsp;&nbsp; Terms</span></div></footer>
    <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} initialDoctor={requestedDoctor} initialService={requestedService}/>
    <button className="floating-book" onClick={() => book()} aria-label="Book an appointment"><CalendarDays size={16}/><span>Book a visit</span></button>
  </>
}

export default App
