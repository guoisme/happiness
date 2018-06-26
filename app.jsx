
class Header extends React.Component{
	render(){
	    return(
	        <div className="header">
	            <div className="common">
	                <h1>幸福收藏站</h1>
	            </div>
	        </div>
	    )
	}
}

class Left extends React.Component{
	render(){
	    return(
	        <div className="left"> 
	            <form className="comment-form" ref="form" >
	                <div className="form-group">
	                    <label>用户名</label>
	                    <input className="form-control" Name="name" ref="name"/>
	                </div>
	                <div className="form-group">
	                    <label>留言</label>
	                    <textarea className="form-control"  ref="content"></textarea>
	                </div>
	                <div className="form-group">
	                    <button onClick={e=>{this.addItemHandle(e)}}>提交</button>
	                </div>
	            </form>
	        </div>
	    )
	}
	addItemHandle(e){
	    e.preventDefault();
        var userName=this.refs.name.getDOMNode().value.trim();
        var content=this.refs.content.getDOMNode().value.trim();
        if(!userName){
           alert('用户名不能为空');
        }else{
            if(!content){
                alert('留言不能为空');
            }else{
                this.props.onSubmit({
                    userName:userName,
                    content:content,
                    id:Date.now()
               });
               this.refs.name.getDOMNode().value='';
               this.refs.content.getDOMNode().value=''
            } 
        }    
    }
}

class Item extends React.Component{
    constructor(){
       var item=(Math.floor(Math.random()*9+1));
        this.state={count:item};
    }
	render(){
	    return(
	       <div className="item" style={{backgroundImage:'url(img/'+this.state.count+'.png)'}}>
	            <span className="close" onClick={id=>{this.delectHandle(this.props.id)}}>X</span>
	            <div className="content">
	             {this.props.content}
	            </div>
	            <div className="name">
	                 <span>To:{this.props.userName}</span>
	            </div>
	       </div>
	    )
	}
	delectHandle(id){
        PubSub.publish('delectItem',id); 
    }
}

class Right extends React.Component{
    
	render(){
	    var isNone = !!this.props.comments.length ? "none" : "block";
	    var commentsNode=this.props.comments.map(function(comment,index){
	        return <Item 
	        key={'comment-'+index}
	        {...comment}/>
	    });
	    return(
	        <div className="right">
	            <h2 className="tip" style={{display:isNone}}>暂无留言，点击左侧添加留言！！！</h2>
	            <div className="item-list">{commentsNode}</div>
	        </div>
	    )
	}
}

class CommentBox extends React.Component{
    constructor(props){
        this.state={
           comments:props.comments||[]
        }
    }
    componentDidMount(){
        PubSub.subscribe('delectItem',function(evName,data){
            var newComments=this.state.comments.filter(function(item,index){
                return item.id!==data
            });
            this.setState({comments:newComments});
        }.bind(this));
    }
	render(){
	   
	    return(
	        <div>
	            <Header/>
	            <div className="common main">
	                <Left  onSubmit={(comment)=>{this.addItem(comment)}}/>
	                <Right  comments={this.state.comments}/>
	            </div>
	        </div>
	    )
	}
	addItem(data){
	    var comments=this.state.comments;
	    var newComments=comments.concat([data]);
        this.setState({comments:newComments});
        console.log(this.state.comments);
    }
}
//后期可结合服务器语言获取数据
var comments=[];

box=React.render(
 <CommentBox comments={comments}/>,
 document.getElementById('content')
);