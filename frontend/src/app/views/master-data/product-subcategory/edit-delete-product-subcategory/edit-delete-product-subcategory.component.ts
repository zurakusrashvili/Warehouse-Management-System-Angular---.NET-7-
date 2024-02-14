import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductCategory } from '@app/_shared/models/master-data/product-category.model';
import { Subcategory } from '@app/_shared/models/master-data/subcategory.model';
import { ProductCategoryService } from '@app/_shared/services/product-category.service';
import { SubcategoryService } from '@app/_shared/services/subcategory.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { environment } from '@environment/environment.development';

@Component({
  selector: 'app-edit-delete-product-subcategory',
  templateUrl: './edit-delete-product-subcategory.component.html',
  styleUrls: ['./edit-delete-product-subcategory.component.scss']
})
export class EditDeleteProductSubcategoryComponent {
  imageBaseUrl = environment.appUrl + '/resources/';

  editProductSubcategoryForm: FormGroup = new FormGroup({});
  submitted = false;
  formErrors: any;
  formControls!: string[];
  productSubcategoryId: number = 0;
  productSubcategory!: Subcategory;
  productCategory!: ProductCategory;
  errorMessages: string[] = [];
  editPage: boolean = true;
  colorButton: string = '';
  productCategories: ProductCategory[] = [];

  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;

  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private productCategoryService: ProductCategoryService,
    private productSubcategoryService: SubcategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.getAllProductCategories();
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.productSubcategoryId = Number(paramMap.get('id'));
      this.productSubcategoryService
        .getSubcategory(this.productSubcategoryId)
        .subscribe({
          next: (response: any) => {
            this.productSubcategory = response.result;
            this.buildForm();
          },
          error: (error: any) => {
            console.log(error);
          },
        });
    });

    let title = this.activatedRoute.snapshot.data['title'];
    
    if (title == 'Delete Product SubCategory') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
  }

  
  getAllProductCategories() {
    this.productCategoryService.getAllProductCategories().subscribe({
      next: (response: any) => {
        this.productCategories = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  buildForm() {
    this.editProductSubcategoryForm = this.formBuilder.group({
      id: [this.productSubcategory.id],
      productCategoryId: [this.productCategory, [Validators.required]],
      name: [this.productSubcategory.name, [Validators.required]],
      description: [this.productSubcategory.description, [Validators.required]],
    });
    this.formControls = Object.keys(this.editProductSubcategoryForm.controls);

    //false for delete page
    if (this.editPage == false) {
      this.editProductSubcategoryForm.get('productCategoryId')?.disable();
      this.editProductSubcategoryForm.get('name')?.disable();
      this.editProductSubcategoryForm.get('description')?.disable();
    }
  }

  onReset() {
    this.submitted = false;
    this.editProductSubcategoryForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.editProductSubcategoryForm.status === 'VALID';
  }

  onSubmit() {
    // console.warn(this.onValidate(), this.editProductSubcategoryForm.value);
    this.submitted = true;
    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.editProductSubcategoryForm.value);

      if (this.editPage) {
        //Edit page
        this.productSubcategoryService
          .updateSubcategory(this.editProductSubcategoryForm.value)
          .subscribe({
            next: (response: any) => {
              
              this.toastrColor = 'success';
              this.errorMessages.push(
                'Successfully edited the productSubcategory'
              );
              this.router.navigateByUrl('/master-data/product-subcategories');
            },
            error: (error: any) => {
              this.toastrColor = 'danger';
              if (error.error.errors) {
                this.errorMessages = error.error.errors;
              } else {
                this.errorMessages.push(error.error);
              }
            },
          });
      }

      // Delete Page
      else {
        this.productSubcategoryService
          .deleteSubcategory(this.editProductSubcategoryForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push(
                'Successfully deleted the productSubcategory'
              );
              this.router.navigateByUrl('/master-data/product-subcategories');
            },
            error: (error: any) => {
              this.toastrColor = 'danger';
              if (error.error.errors) {
                this.errorMessages = error.error.errors;
              } else {
                this.errorMessages.push(error.error);
              }
            },
          });
      }
    }
  }
}
