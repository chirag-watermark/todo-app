class Api::V1::TodosController < ApplicationController

    include JwtAuthenticable
    before_action :authorize_request
    before_action :set_todo, only: [:show, :update, :destroy]

    def index
        @todos = current_user.todos
        render json: {success: true, message: "Todos fetched successfully", data: @todos}
    end

    def show
        render json: {success: true, message: "Todo fetched successfully", data: @todo}
    end

    def create 
        @todo = current_user.todos.build(todo_params)
        if @todo.save
            render json: {success: true, message: "Todo created successfully", data: @todo}, status: :created
        else
            render json: {success: false, message: "Todo creation failed", errors: @todo.errors.full_messages}, status: :unprocessable_entity
        end
    end

    def update
        if @todo.update(todo_params)
            render json: {success: true, message: "Todo updated successfully", data: @todo}, status: :ok
        else
            render json: {success: false, message: "Todo update failed", errors: @todo.errors.full_messages}, status: :unprocessable_entity
        end
    end

    def destroy
        @todo = Todo.find(params[:id])
        if @todo.destroy
                render json: {success: true, message: "Todo deleted successfully"}, status: :ok
        else
            render json: {success: false, message: "Todo deletion failed", errors: @todo.errors.full_messages}, status: :unprocessable_entity 
        end
    end
    
    private

    def set_todo
        @todo = current_user.todos.find(params[:id])
    end

    def todo_params
        params.permit(:title, :description, :dueDate, :status, :priority)
    end

end
