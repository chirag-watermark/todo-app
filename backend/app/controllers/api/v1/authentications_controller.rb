class Api::V1::AuthenticationsController < ApplicationController
  
  def login
    user = User.find_by(username: params[:username])
    if user && user.authenticate(params[:password])
      token = JwtService.encode(user_id: user.id.to_s)
      render json: { 
        success: true, 
        message: "Login successful", 
        data: {  
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
          },
          token: token
        }
      }, status: :ok
    else
      render json: { error: "Invalid username or password" }, status: :unauthorized
    end
  end

  def register
    user = User.new(register_params)
    if user.save
      token = JwtService.encode(user_id: user.id.to_s)
      render json: { 
        success: true, 
        message: "User created successfully", 
        data: {
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
          },
          token: token
        }
      }, status: :created 
    else
      render json: { error: "User creation failed", errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    user = User.find(params[:id])
    if user.update(update_profile_params)
      render json: { success: true, message: "Profile updated successfully" }, status: :ok
    else
      render json: { error: "Failed to update profile", errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    user = User.find(params[:id])
    if user.destroy
      render json: { success: true, message: "Account deleted successfully" }, status: :ok
    else
      render json: { error: "Failed to delete account", errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def register_params
    params.permit(:username, :name, :password)
  end


  def update_profile_params
    params.permit(:name, :username, :password, :current_password)
  end
  
end