#uncomment the line below if you aren't using bundler
#require 'rubygems'
#require 'linkedin'

class LinkedinsController < ApplicationController

  def index
    # get your api keys at https://www.linkedin.com/secure/developer
    client = LinkedIn::Client.new("lI6W0aPijmrR4FaqePmRTNjw8dJIoMqtA94Z_3NzEEe4odUCtEN4Btwd_Nfzzs4A", "BsC51hSk-SaoNSxSG5Aa2kSfa4G6wc-3jLUqiU-BWkJ5dc32iFtzl12SU_grDJIn")
    request_token = client.request_token(:oauth_callback =>"http://#{request.host_with_port}/auth/callback")
    session[:rtoken] = request_token.token
    session[:rsecret] = request_token.secret

    redirect_to client.request_token.authorize_url

  end

  def callback
    client = LinkedIn::Client.new("your_api_key", "your_secret")
    if session[:atoken].nil?
      pin = params[:oauth_verifier]
      atoken, asecret = client.authorize_from_request(session[:rtoken], session[:rsecret], pin)
      session[:atoken] = atoken
      session[:asecret] = asecret
    else
      client.authorize_from_access(session[:atoken], session[:asecret])
    end
    @profile = client.profile
    @connections = client.connections
  end
end