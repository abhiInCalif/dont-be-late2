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

  public Result track() {
    return ok(track.render());
  }
}
