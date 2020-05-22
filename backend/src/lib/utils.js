export function IssueTracker(){
  this.issues = []
}

IssueTracker.prototype = {
  add: function(issue){
    this.issues.push(issue)
  },
  retrieve: function(){
    let message = {}
    switch (this.issues.length){
      case 400:
        message
        break
      case 401:
        break
      case 403:
        break
    }
  },
}


