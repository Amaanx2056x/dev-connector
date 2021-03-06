import React, {
  useState,
  Fragment
} from 'react';
import {
  connect
} from 'react-redux'
import {Spinner} from '../layout/Spinner'
import {
  createProfile
} from '../../actions/profile'
import {
  Link,
  withRouter
} from 'react-router-dom'
const CreateProfile = ({
  createProfile, history
})=> {
  const [loading,setLoading]= useState(false)
  const [formData,
    setFormData] = useState({
      avatar: null,
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      githubusername: '',
      bio: '',
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    })
  const {
    avatar,
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    instagram,
    linkedin,
    youtube
  } = formData
  const [displaySocial,
    setSocialDisplay] = useState(false)

  const changeHandler = (e)=> {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    })
  }
    const avatarChange=(e)=>{
          setFormData({
           ...formData, avatar: e.target.files[0]
          })
  }
  const submitHandler = async (e)=> {
    e.preventDefault()
    setLoading(true)
  const fd = new FormData();
   fd.append('avatar',avatar)
   fd.append('company',company);
   fd.append('website', website);
   fd.append('location',location);
   fd.append('status',status);
   fd.append('skills', skills);
   fd.append('githubusername',githubusername);
   fd.append('bio',bio);
   fd.append('twitter',twitter);
   fd.append('facebook',facebook);
   fd.append('instagram',instagram);
   fd.append('linkedin',linkedin)
   fd.append('youtube',youtube)
    await createProfile(fd, history)
    setLoading(false)
  }
  return (loading ? <Spinner /> :
    <Fragment>

      <h1 className="large text-primary">

        Create Your Profile
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
    </p>
      <small>* = required field</small>
      <form className="form" onSubmit={submitHandler}>
      <div className="form-group">
          <input type="file" accept="image/*" name="avatar" onChange={avatarChange} />
          <small className="form-text"
          >Please upload a picture (2 MB or less)</small
        >
        </div>
        <div className="form-group">
          <select name="status" value={status} onChange={changeHandler}>
            <option value="">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text"
        >Give us an idea of where you are at in your career</small
        >
      </div>
        <div className="form-group">
          <input type="text" placeholder="Company" name="company" value={company} onChange={changeHandler} />
          <small className="form-text"
          >Could be your own company or one you work for</small
        >
      </div>
        <div className="form-group">
          <input type="url" placeholder="Website" name="website" value={website} onChange={changeHandler} />
          <small className="form-text"
          >Could be your own or a company website</small
        >
      </div>
        <div className="form-group">
          <input type="text" placeholder="Location" name="location" value={location} onChange={changeHandler} />
          <small className="form-text"
          >City & state suggested (eg. Boston, MA)</small
        >
      </div>
        <div className="form-group">
          <input type="text" placeholder="* Skills" name="skills" value={skills} onChange={changeHandler} />
          <small className="form-text"
          >Please use comma separated values (eg.
            HTML,CSS,JavaScript,PHP)</small
        >
      </div>
        <div className="form-group">
          <input
        type="text"
        placeholder="Github Username"
        name="githubusername"
        value={githubusername} onChange={changeHandler} />
          <small className="form-text"
          >If you want your latest repos and a Github link, include your
            username</small
        >
      </div>
        <div className="form-group">
          <textarea placeholder="A short bio of yourself" name="bio" value={bio} onChange={changeHandler}></textarea>
          <small className="form-text">Tell us a little about yourself</small>
      </div>

        <div className="my-2">
          <button onClick={()=> { setSocialDisplay(!displaySocial)}} type="button" className="btn btn-light">
            Add Social Network Links
          </button>
          <span>Optional</span>
      </div>
      {displaySocial && <Fragment>
             <div className="form-group social-input">
          <i className="fab fa-twitter fa-2x"></i>
          <input type="url" placeholder="Twitter URL" name="twitter" value={twitter} onChange={changeHandler} />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-facebook fa-2x"></i>
          <input type="url" placeholder="Facebook URL" name="facebook" value={facebook} onChange={changeHandler} />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-youtube fa-2x"></i>
          <input type="url" placeholder="YouTube URL" name="youtube" value={youtube} onChange={changeHandler} />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-linkedin fa-2x"></i>
          <input type="url" placeholder="Linkedin URL" name="linkedin" value={linkedin} onChange={changeHandler} />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-instagram fa-2x"></i>
          <input type="url" placeholder="Instagram URL" name="instagram" value={instagram} onChange={changeHandler} />
        </div>
      </Fragment>}
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
    </form>
    </Fragment>
    )
  
}

export default connect(null, {
  createProfile
})(withRouter(CreateProfile))