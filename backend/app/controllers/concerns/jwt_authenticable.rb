module JwtAuthenticable
  extend ActiveSupport::Concern

  included do 
    before_action :authenticate_request
  end

  private

  def authenticate_request    
    
    header = request.headers['Authorization']
    header = header.split(" ").last if header

    begin
      @decoded = JwtService.decode(header)
      @current_user = User.find(@decoded[:user_id])
    rescue JWT::DecodeError => e
      render json: { error: e.message }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def authorize_request
    unless current_user
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  def skip_authentication
    @skip_authentication = true
  end 
end 