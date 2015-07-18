package controllers;

import play.*;
import play.mvc.*;

import views.html.*;


public class Application extends Controller {

  public Result index() {
    return ok(index.render());
  }

  public Result login() {
    return ok(login.render());
  }

  public Result create() {
    return ok(create.render());
  }

  public Result track(String id) {
    return ok(track.render(id));
  }

  public Result leader() {
    return ok(leader.render());
  }
}
