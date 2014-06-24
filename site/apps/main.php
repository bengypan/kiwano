<!DOCTYPE html>
<html ng-app="KiwanoApp">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>Kiwano</title>
    <link rel="icon" href="static/img/favicon.png">
    <link href="/css/ionic.css" rel="stylesheet">
    <link href="/css/app.css" rel="stylesheet">
    <script type="text/javascript" src="/js/lib/ionic.bundle.js"></script>
    <script src="https://cdn.firebase.com/js/client/1.0.15/firebase.js"></script>
    <script type="text/javascript" src="/js/stopwords.js"></script>
    <script type="text/javascript" src="/js/kiwano-app.js"></script>
    <script type="text/javascript">kiwanoApp.value('kiwanoUserId', '<?php echo $_SESSION['uid']; ?>');</script> 
    <script src="https://cdn.firebase.com/libs/angularfire/0.7.1/angularfire.min.js"></script>
  </head>
  <body>
    <ion-nav-bar class="nav-title-slide-ios7 bar-stable">
      <ion-nav-back-button class="button-icon ion-arrow-left-c"></ion-nav-back-button>
    </ion-nav-bar>

    <ion-nav-view animation="slide-left-right"></ion-nav-view>

    <script id="tabs.html" type="text/ng-template">
      <ion-tabs class="tabs-icon-top tabs-stable">
        <ion-tab title="Home" icon="ion-home" href="#/tab/home">
          <ion-nav-view name="home-tab"></ion-nav-view>
        </ion-tab>
        <ion-tab title="Questions" icon="ion-chatbubble-working" href="#/tab/qlist">
          <ion-nav-view name="question-tab"></ion-nav-view>
        </ion-tab>
        <ion-tab title="Inbox" icon="ion-archive" href="#/tab/rlist">
          <ion-nav-view name="request-tab"></ion-nav-view>
        </ion-tab>
        <ion-tab title="About" icon="ion-ios7-information" href="#/tab/about">
          <ion-nav-view name="about-tab"></ion-nav-view>
        </ion-tab>
      </ion-tabs>
    </script>

    <script id="home.html" type="text/ng-template">
      <ion-view title="Home">
        <ion-content class="padding">
          <div class="list">
            <div class="item item-thumbnail-left">
              <img src="{{prof.pic_url}}">
              <h2>{{prof.first_name}} {{prof.last_name}}</h2>
              <p>{{prof.headline}}</p>
            </div>
            <a href="#/tab/qlist" class="item"> My Questions </a>
            <a href="#/tab/rlist" class="item"> My Inbox </a>
            <br/>
          </div>
          <div class="list">
            <a href="/?logout=landing" class="button button-block button-stable">Log Out</a>
            <br/>
          </div>
        </ion-content>
      </ion-view>
    </script>

    <script id="question-list.html" type="text/ng-template">
      <ion-view title="My Questions">
        <ion-nav-buttons side="right">
          <a class="button button-stable icon ion-plus-round no-animation"
            href="#/tab/ask"></a>&nbsp;
        </ion-nav-buttons>
        <ion-content class="padding">
          <div class="list">
            <a ng-repeat="q in questions | orderByPriority" class="item" href="#/tab/question/{{q.$id}}">
              {{q.question}}
              <span class="badge badge-stable">{{q.replies.length || 0}}</span>
            </a>
          </div>
        </ion-content>
      </ion-view>
    </script>

    <script id="question-details.html" type="text/ng-template">
      <ion-view title="Question and Answers">
        <ion-content class="padding">
          <div class="item item-divider">Question</div>
          <div class="item item-body">
            {{question.question}}
            <p>Asked on {{question.date}}</p>
          </div>
          <div class="item item-divider">Answers</div>
          <div ng-repeat="r in question.replies" class="item item-body">
            {{r.reply}}
            <p>Answered on {{r.date}}</p>
          </div>
        </ion-content>
      </ion-view>
    </script>

    <script id="ask.html" type="text/ng-template">
      <ion-view title="Ask New Question">
        <ion-content>
          <div class="list list-inset">
            <label class="item item-input">
              <i class="icon ion-help-circled placeholder-icon"></i>
              <input type="text" placeholder="Ask a question" ng-model="question" ng-change="change(this.question)">
            </label>
            <label class="item item-stable">
              To: <span ng-repeat="u in selectedUsers"}}>{{u}}; </span>
            </label>
          </div>

          <div class="list card">
            <li class="item item-checkbox item-checkbox-right item-avatar" ng-repeat="rec in recs" >
              <label class="checkbox checkbox-stable">
              <input type="checkbox" ng-model="selectedUsers[rec.uid]"
                 ng-true-value="{{rec.first_name}} {{rec.last_name}}" ng-false-value="">
              <div class="item-content">
                <img src="{{rec.pic_url}}"/>
                <h2>{{rec.first_name}} {{rec.last_name}}</h2>
                <p>{{rec.headline}} {{rec.score}}</p>
              </div>
            </label>
          </div>

          <div class="row">
            <div class="col-50 padding">
              <button class="button button-block button-stable" ng-click="more()">More People</button>
            </div>
            <div class="col-50 padding">
              <button class="button button-block button-positive" ng-if="selCount()" ng-click="submit(this.question)">Submit</button>
            </div>
          </div>
        </ion-content>
      </ion-view>
    </script>

    <script id="request-list.html" type="text/ng-template">
      <ion-view title="My Inbox">
        <ion-content class="padding">
          <div class="list">
            <a ng-repeat="r in requests | orderByPriority" ng-if="r.status==='P'"
              class="item" href="#/tab/request/{{r.$id}}">
              {{r.question}}
              <span class="badge badge-stable">{{r.status}}</span>
            </a>
          </div>
        </ion-content>
      </ion-view>
    </script>

    <script id="request-details.html" type="text/ng-template">
      <ion-view title="Question Details">
        <ion-content class="padding">
          <div class="item item-divider">Question</div>
          <div class="item item-body">
            {{request.question}}
            <p>Asked on {{request.date}} by {{request.from.name}}</p>
          </div>
          <div class="item item-divider">My Answer</div>
          <div class="item item-body item-input">
            <textarea placeholder="Comments" rows="5" ng-model="reply"></textarea>
          </div>
          <div class="row">
            <div class="col-50 padding">
              <button class="button button-block button-stable" ng-click="ignore()">Ignore</button>
            </div>
            <div class="col-50 padding">
              <button class="button button-block button-positive" ng-click="save(this)">Submit</button>
            </div>
          </div>
        </ion-content>
      </ion-view>
    </script>

    <script id="about.html" type="text/ng-template">
      <ion-view title="About Kiwano">
        <ion-content class="padding">
          <p>This app is built with the following technologies</p>
          <div class="item item-avatar-left">
            <img class="tech-logo" src="/img/ionic_logo.png"/>
            <h2>Ionic Framework</h2>
            <p>Create mobile apps with web technologies.</p>
          </div>
          <div class="item item-avatar-left">
            <img class="tech-logo" src="/img/angularjs_logo.png"/>
            <h2>AngularJS</h2>
            <p>HTML enhanced for web apps!</p>
          </div>
          <div class="item item-avatar-left">
            <img class="tech-logo" src="/img/html5_logo.png"/>
            <h2>HTML5</h2>
            <p>The next generation of HTML.</p>
          </div>
          <div class="item item-avatar-left">
            <img class="tech-logo" src="/img/firebase_logo.png"/>
            <h2>FireBase</h2>
            <p>A realtime backend as a service. </p>
          </div>
          <div class="item item-avatar-left">
            <img class="tech-logo" src="/img/php_logo.png"/>
            <h2>PHP</h2>
            <p>Who don't know PHP</p>
          </div>
          <div class="item item-avatar-left">
            <img class="tech-logo" src="/img/gimp_logo.png"/>
            <h2>FireBase</h2>
            <p>The opensource Photoshop</p>
          </div>
        </ion-content>
      </ion-view>
    </script>

  </body>
</html>
