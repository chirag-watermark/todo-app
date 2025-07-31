class Todo
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, type: String
  field :description, type: String
  field :dueDate, type: Date, default: -> {Date.current}
  field :status, type: String, default: "Pending"
  field :priority, type: String, default: "Medium"

  belongs_to :user, inverse_of: :todos, optional: false
  
  validates :title, presence: true
  validates :status, inclusion: {in: ["Pending", "Completed", "Started"]}, presence: true
  validates :priority, inclusion: {in: ["Low", "Medium", "High"]}, presence: true
  # validates :dueDate, comparison: {greater_than_or_equal_to: Date.current}, if: -> {dueDate.present?}

  before_save :sanitize_fields

  private 

  def sanitize_fields
    self.title = title.to_s.strip
    self.description = description.to_s.strip if description
  end
 
end
