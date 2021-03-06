import React,{Fragment} from 'react'
import {
  connect
} from 'react-redux'
import {addLike, removeLike,deletePost} from '../../actions/post'
import {Link} from 'react-router-dom'
import Moment from 'react-moment'

const PostItem=({addLike,removeLike,deletePost,auth,post:{_id,name,image,text,likes,comments,user,date,avatar},showActions})=>{
  return (
    <div className="post bg-white p-1 my-1">

          <div>

            <Link to={`/profile/${user}`}>

             {(avatar) ? <img src={avatar} alt="" /> : 
              <i className="fa fa-user fa-5x m-1"  style={{color: 'black'}}/>

  }
              <h4>{name}</h4>
            </Link>
          </div>
          <div>
          {image &&  <img src={image} alt="" style={{width: "100%", height: "100%"}} />}
            <p className="my-1">
             {text}
            </p>
             <p className="post-date">
                Posted on <Moment format="DD/MM/YYYY">{date}</Moment>
            </p>
            {showActions && <Fragment>
            
             <button onClick={e=>addLike(_id)} type="button" className="btn btn-light">
              <i className="fas fa-thumbs-up"></i>{' '}
             <span> {likes.length > 0 && (<span>{likes.length}</span>)}</span>
            </button>
            <button onClick={e=>removeLike(_id)} type="button" className="btn btn-light">
              <i className="fas fa-thumbs-down"></i>
            </button>
            <Link to={`/post/${_id}`} className="btn btn-primary">
              Discussion{' '}
{comments.length>0 && (<span className='comment-count'>{comments.length}</span>) }

            </Link>
            {!auth.loading && user === auth.user._id && (
              <button      
            type="button" onClick={e=>deletePost(_id)}
            className="btn btn-danger"
          >
            <i className="fas fa-times"></i>
          </button>
            )}
            
            </Fragment>}
           
          
          </div>
        </div>
    
    )
}
PostItem.defaultProps={
  showActions: true
}
const mapStatetoProps = (state) =>({
  auth: state.auth
})
export default connect(mapStatetoProps, {addLike,removeLike,deletePost}
  )(PostItem)